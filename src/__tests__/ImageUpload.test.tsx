import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import ImageUpload from '../components/creation/ImageUpload';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
}

describe('ImageUpload', () => {
  it('无图片时应显示上传区域', () => {
    renderWithTheme(<ImageUpload value="" onChange={vi.fn()} />);
    expect(screen.getByText(/上传参考图片/)).toBeInTheDocument();
  });

  it('应显示支持的格式提示', () => {
    renderWithTheme(<ImageUpload value="" onChange={vi.fn()} />);
    expect(screen.getByText(/JPG\/PNG\/WebP/)).toBeInTheDocument();
  });

  it('应显示最大文件大小（默认5MB）', () => {
    renderWithTheme(<ImageUpload value="" onChange={vi.fn()} />);
    expect(screen.getByText(/5MB/)).toBeInTheDocument();
  });

  it('自定义 maxSizeMB 应显示对应大小', () => {
    renderWithTheme(<ImageUpload value="" onChange={vi.fn()} maxSizeMB={10} />);
    expect(screen.getByText(/10MB/)).toBeInTheDocument();
  });

  it('有图片时应显示预览', () => {
    renderWithTheme(
      <ImageUpload value="data:image/png;base64,test" onChange={vi.fn()} />
    );
    // Should show the image with alt text "参考图片"
    const img = screen.getByAltText('参考图片');
    expect(img).toBeInTheDocument();
  });

  it('有图片时应显示删除按钮', () => {
    renderWithTheme(
      <ImageUpload value="data:image/png;base64,test" onChange={vi.fn()} />
    );
    // Delete icon button should be visible
    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toBeInTheDocument();
  });

  it('点击删除按钮应调用 onChange("")', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(
      <ImageUpload value="data:image/png;base64,test" onChange={onChange} />
    );

    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('disabled 时上传区域应不可点击', () => {
    renderWithTheme(<ImageUpload value="" onChange={vi.fn()} disabled />);
    // The upload area should have cursor: default, but we can check the input is disabled
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.disabled).toBe(true);
  });

  it('disabled 时不应显示删除按钮', () => {
    renderWithTheme(
      <ImageUpload value="data:image/png;base64,test" onChange={vi.fn()} disabled />
    );
    // No delete button when disabled
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('应有隐藏的 file input', () => {
    renderWithTheme(<ImageUpload value="" onChange={vi.fn()} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.accept).toBe('image/*');
  });
});
