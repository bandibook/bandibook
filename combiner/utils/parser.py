import os


class Parser:
    def __init__(self):
        pass

    @staticmethod
    def find_all_directories(base_path, *paths):
        path = os.path.join(base_path, *paths)

        if not os.path.exists(path):
            raise FileNotFoundError(f"The path {path} does not exist.")

        if not os.path.isdir(path):
            raise NotADirectoryError(f"The path {path} is not a directory.")

        return [f for f in os.listdir(path) if os.path.isdir(os.path.join(path, f))]

    @staticmethod
    def find_all_files(base_path, *paths):
        path = os.path.join(base_path, *paths)

        if not os.path.exists(path):
            raise FileNotFoundError(f"The path {path} does not exist.")

        if not os.path.isdir(path):
            raise NotADirectoryError(f"The path {path} is not a directory.")

        return [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]

    @staticmethod
    def join_paths(base_path, *paths):
        return os.path.join(base_path, *paths)

    @staticmethod
    def find_common_files(path):
        directories = Parser.find_all_directories(path)

        if not directories:
            return set()

        common_files = set(Parser.find_all_files(path, directories[0]))


        for directory in directories[1:]:
            files = set(Parser.find_all_files(path, directory))
            common_files.intersection_update(files)

        return common_files

