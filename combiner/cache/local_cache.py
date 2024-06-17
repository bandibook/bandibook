import os
import json


class LocalCache:
    def __init__(self, cache_file):
        self.cache_file = cache_file
        self.cache_data = self.__load_cache()

    def __save_cache(self):
        with open(self.cache_file, 'w', encoding='utf-8') as f:
            json.dump(self.cache_data, f)

    def update_cache(self, book_name, file_name, mod_time, reviewer_count):
        if book_name not in self.cache_data:
            self.cache_data[book_name] = {}

        if file_name not in self.cache_data[book_name]:
            self.cache_data[book_name][file_name] = {}

        self.cache_data[book_name][file_name]["reviewer_count"] = reviewer_count
        self.__save_cache()

    def need_update(self, book_name, file_name, mod_time, reviewer_count):
        if self.__get_study_reviewer_count(book_name, file_name) != reviewer_count or self.__is_cache_miss(book_name, file_name):
                return True

        return False

    def __is_cache_miss(self, book_name, file_name):
        return file_name not in self.cache_data.get(book_name, {})

    def __get_study_reviewer_count(self, book_name, file_name):
        return self.cache_data.get(book_name, {}).get(file_name, {}).get("reviewer_count")

    def __load_cache(self):
        if os.path.exists(self.cache_file):
            with open(self.cache_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}