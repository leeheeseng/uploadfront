import os

folder_path = r"D:\Study Summary\clonecode\uploadfront\public\coverimg"

def rename_files_with_numbers(folder):
    files = os.listdir(folder)
    # jpg, jpeg 파일만 필터링 후 정렬 (정확한 순서 위해)
    jpg_files = sorted([f for f in files if f.lower().endswith(('.jpg', '.jpeg'))])
    
    for i, file in enumerate(jpg_files, start=1):
        ext = os.path.splitext(file)[1].lower()
        new_name = f"image_{i}{ext}"
        src = os.path.join(folder, file)
        dst = os.path.join(folder, new_name)
        
        if os.path.exists(dst):
            print(f"[SKIP] {new_name} 이미 존재")
            continue
        
        print(f"Renaming: {file} -> {new_name}")
        os.rename(src, dst)

if __name__ == "__main__":
    rename_files_with_numbers(folder_path)
