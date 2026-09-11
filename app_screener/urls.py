from django.urls import path
from .views import UploadResumeView, AnalyzeResumeView, GetAnalysisView

urlpatterns = [
    path("upload-resume/", UploadResumeView.as_view(), name="upload-resume"),
    path(
        "analyze/<int:resume_id>/", AnalyzeResumeView.as_view(), name="analyze-resume"
    ),
    path("analysis/<int:resume_id>/", GetAnalysisView.as_view(), name="get-analysis"),
]
