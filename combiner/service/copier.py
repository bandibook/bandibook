import os
import shutil

from combiner.cache.local_cache import LocalCache
from combiner.utils.parser import Parser

class FileCopier:
    NO_REVIEWER = 0

    def __init__(self, individual_study_dir, combine_dir, cache_file):
        self.individual_study_dir = individual_study_dir
        self.combine_dir = combine_dir
        self.cache = LocalCache(cache_file)

    def copy_files(self, book_name):
        directories = Parser.find_all_directories(self.individual_study_dir, book_name)

        for directory in directories:
            source_path = os.path.join(book_name, directory)
            self.__copy_files(source_path)    

    def __copy_files(self, source_path):
        files = Parser.find_all_files(self.individual_study_dir, source_path)

        for file_name in files:
            file_mod_time = self.__get_file_mod_time(source_path, file_name)

            if self.cache.need_update(source_path, file_name, file_mod_time, self.NO_REVIEWER):
                self.__copy_file(source_path, file_name)
                self.cache.update_cache(source_path, file_name, file_mod_time, self.NO_REVIEWER)

    def __copy_file(self, source_path, file_name):
        destination_dir = os.path.join(self.combine_dir, source_path)
        os.makedirs(destination_dir, exist_ok=True)

        source_file = os.path.join(self.individual_study_dir, source_path, file_name)
        shutil.copy2(source_file, destination_dir)

    def __get_file_mod_time(self, source_path, file_name):
        file_path = os.path.join(self.individual_study_dir, source_path, file_name)
        return os.path.getmtime(file_path)