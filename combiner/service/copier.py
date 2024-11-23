import os
import shutil

from combiner.cache.local_cache import LocalCache
from combiner.utils.parser import Parser

class FileCopier:
    NO_REVIEWER = 0

    def __init__(self, root_dir, combine_dir, cache_file):
        self.root_dir = root_dir
        self.combine_dir = combine_dir
        self.cache = LocalCache(cache_file)

    def copy_files(self, source_path):
        files = Parser.find_all_files(self.root_dir, source_path)

        for file_name in files:
            file_mod_time = self.__get_file_mod_time(source_path, file_name)

            if self.cache.need_update(source_path, file_name, file_mod_time, self.NO_REVIEWER):
                self.__copy_file(source_path, file_name)
                self.cache.update_cache(source_path, file_name, file_mod_time, self.NO_REVIEWER)

    def __copy_file(self, source_path, file_name):
        destination_dir = os.path.join(self.combine_dir, source_path)
        os.makedirs(destination_dir, exist_ok=True)

        source_file = os.path.join(self.root_dir, source_path, file_name)
        shutil.copy2(source_file, destination_dir)

    def __get_file_mod_time(self, source_path, file_name):
        file_path = os.path.join(self.root_dir, source_path, file_name)
        return os.path.getmtime(file_path)