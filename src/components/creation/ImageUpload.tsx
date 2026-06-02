import React, { useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

/** Props for ImageUpload */
interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
  maxSizeMB?: number;
}

/** Image upload component — drag/click upload with preview */
const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
  maxSizeMB = 5,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  const processFile = useCallback(
    (file: File) => {
      setError('');

      // Validate type
      if (!file.type.startsWith('image/')) {
        setError('请上传图片文件');
        return;
      }

      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`图片大小不能超过 ${maxSizeMB}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.onerror = () => {
        setError('读取文件失败，请重试');
      };
      reader.readAsDataURL(file);
    },
    [maxSizeMB, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so same file can be re-selected
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {value ? (
        // Preview mode
        <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
          <Box
            component="img"
            src={value}
            alt="参考图片"
            sx={{
              width: '100%',
              maxHeight: 200,
              objectFit: 'contain',
              borderRadius: 2,
              bgcolor: 'grey.50',
            }}
          />
          {!disabled && (
            <IconButton
              size="small"
              onClick={handleRemove}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>
      ) : (
        // Upload area
        <Box
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            py: 3,
            px: 2,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: isDragOver ? 'primary.main' : 'divider',
            bgcolor: isDragOver ? 'primary.50' : 'grey.50',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: disabled ? 'divider' : 'primary.main',
              bgcolor: disabled ? 'grey.50' : 'primary.50',
            },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 32, color: disabled ? 'grey.400' : 'primary.main' }} />
          <Typography variant="body2" color={disabled ? 'text.disabled' : 'text.secondary'} sx={{ textAlign: 'center' }}>
            点击或拖拽上传参考图片
          </Typography>
          <Typography variant="caption" color="text.disabled">
            支持 JPG/PNG/WebP，最大 {maxSizeMB}MB
          </Typography>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
