const express = require('express');
const router = express.Router();
const {
  uploadFiles,
  getAttachments,
  getAttachment,
  deleteAttachment,
} = require('../controllers/attachmentsController');
const authMiddleware = require('../middleware/auth');
const { heavyGetLimiter, postLimiter } = require('../middleware/rateLimiter');
const {
  upload,
  saveValidatedFiles,
  handleUploadError,
} = require('../middleware/upload');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/attachments/:reportId/upload - Upload files for a report
router.post(
  '/:reportId/upload',
  postLimiter,
  upload.array('files', 5),
  saveValidatedFiles,
  handleUploadError,
  uploadFiles
);

// GET /api/attachments/:reportId - Get attachments for a report
router.get('/:reportId', heavyGetLimiter, getAttachments);

// GET /api/attachments/file/:attachmentId - Download/view an attachment
router.get('/file/:attachmentId', heavyGetLimiter, getAttachment);

// DELETE /api/attachments/:attachmentId - Delete an attachment
router.delete('/:attachmentId', postLimiter, deleteAttachment);

module.exports = router;
