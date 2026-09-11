from rest_framework import serializers
from .models import Resume, Analysis


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ["id", "user_name", "file", "job_description", "uploaded_at"]


class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = [
            "id",
            "resume",
            "ats_score",
            "missing_keywords",
            "suggestions",
            "formatting_issues",
            "created_at",
        ]
