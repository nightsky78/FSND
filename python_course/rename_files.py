import os
def rename_file():
    file_list = os.listdir(r"C:\Users\johan\Desktop\prank")
    save_dir = os.getcwd()

    for file_name in file_list:
            new_file_name = file_name.translate(None,"0123456789")
            print(new_file_name + file_name)
            os.chdir(r"C:\Users\johan\Desktop\prank")
            os.rename(file_name , new_file_name)

    os.chdir(save_dir)

rename_file()
