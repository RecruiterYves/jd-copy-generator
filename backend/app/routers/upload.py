"""File upload router — accepts multiple documents, parses them, and returns results."""

from typing import List

from fastapi import APIRouter, File, UploadFile

from app.models.schemas import UploadResponse
from app.services.parser import document_parser

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_files(files: List[UploadFile] = File(...)) -> UploadResponse:
    """Upload one or more documents (PDF, DOCX, TXT) for parsing.

    Each file is parsed independently. If one file fails, the others still
    succeed and the error is reported in the ``errors`` list.
    """
    if not files:
        return UploadResponse()

    results, errors = await document_parser.parse_batch(files)

    total_chars = sum(r.char_count for r in results)

    return UploadResponse(
        results=results,
        total_chars=total_chars,
        errors=errors,
    )
