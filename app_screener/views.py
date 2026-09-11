from django.shortcuts import render

# Create your views here.
import pdfplumber
import json
import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Resume, Analysis
from .serializers import ResumeSerializer, AnalysisSerializer


def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


class UploadResumeView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            resume = serializer.save()
            return Response(
                ResumeSerializer(resume).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


import time


class AnalyzeResumeView(APIView):
    def post(self, request, resume_id):
        try:
            resume = Resume.objects.get(id=resume_id)
        except Resume.DoesNotExist:
            return Response(
                {"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND
            )

        resume_text = extract_text_from_pdf(resume.file.path)

        prompt = f"""
You are an expert ATS (Applicant Tracking System) resume reviewer.

Resume text:
{resume_text}

Job description (if provided):
{resume.job_description or "Not provided"}

Analyze the resume and respond ONLY with valid JSON in this exact format, no extra text:
{{
    "ats_score": <number between 0-100>,
    "missing_keywords": [<list of important keywords missing from resume>],
    "suggestions": [<list of 3-5 specific improvement suggestions>],
    "formatting_issues": [<list of formatting problems, if any>]
}}
"""

        api_key = os.getenv("LLM_API_KEY")
        parsed = None
        max_retries = 4

        for attempt in range(max_retries):
            try:
                response = requests.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}",
                    headers={"content-type": "application/json"},
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                )
                result = response.json()
                print("RAW API RESPONSE:", result)

                if "candidates" in result:
                    raw_text = result["candidates"][0]["content"]["parts"][0]["text"]
                    clean_text = (
                        raw_text.replace("```json", "").replace("```", "").strip()
                    )
                    parsed = json.loads(clean_text)
                    break
                else:
                    print(f"Attempt {attempt + 1} failed, retrying...")
                    time.sleep(3)

            except Exception as e:
                print(f"Attempt {attempt + 1} exception: {e}")
                time.sleep(3)

        if parsed is None:
            return Response(
                {"error": "LLM is currently overloaded. Please try again in a moment."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        analysis = Analysis.objects.create(
            resume=resume,
            ats_score=parsed.get("ats_score", 0),
            missing_keywords=parsed.get("missing_keywords", []),
            suggestions=parsed.get("suggestions", []),
            formatting_issues=parsed.get("formatting_issues", []),
        )

        return Response(
            AnalysisSerializer(analysis).data, status=status.HTTP_201_CREATED
        )


class GetAnalysisView(APIView):
    def get(self, request, resume_id):
        analyses = Analysis.objects.filter(resume_id=resume_id).order_by("-created_at")
        if not analyses.exists():
            return Response(
                {"error": "No analysis found"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(AnalysisSerializer(analyses.first()).data)
