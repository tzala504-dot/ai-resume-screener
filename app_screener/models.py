# Create your models here.
from django.db import models


class Resume(models.Model):
    user_name = models.CharField(max_length=100, blank=True)
    file = models.FileField(upload_to="resumes/")
    job_description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.user_name or 'Anonymous'} - {self.uploaded_at.strftime('%d %b %Y')}"
        )


class Analysis(models.Model):
    resume = models.ForeignKey(
        Resume, on_delete=models.CASCADE, related_name="analyses"
    )
    ats_score = models.IntegerField()
    missing_keywords = models.JSONField(default=list)
    suggestions = models.JSONField(default=list)
    formatting_issues = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis for {self.resume} - Score: {self.ats_score}"
