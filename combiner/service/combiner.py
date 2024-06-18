import html
import os

from combiner.utils.parser import Parser
from combiner.cache.local_cache import LocalCache


class Combiner:
    def __init__(self, individual_study_dir, combine_dir, cache_file):
        self.individual_study_dir = individual_study_dir
        self.cache = LocalCache(cache_file)
        self.combine_dir = combine_dir

    def combine(self, all_finished_files, book_reviews_path, book_name, reviewer_count):
        for file_name in all_finished_files:
            file_path = os.path.join(book_reviews_path, next(iter(os.listdir(book_reviews_path))), file_name)
            file_mod_time = os.path.getmtime(file_path)

            if self.cache.need_update(book_name, file_name, file_mod_time, reviewer_count):
                self.__combine_files(book_name, file_name)
                self.cache.update_cache(book_name, file_name, file_mod_time, reviewer_count)

    def __combine_files(self, book_name, file_name):
        book_path = Parser.join_paths(self.individual_study_dir, book_name)
        reviewers = Parser.find_all_directories(book_path)
        content = ""

        for reviewer in reviewers:
            reviewer_path = Parser.join_paths(book_path, reviewer)
            file_path = os.path.join(reviewer_path, file_name)

            if os.path.isdir(reviewer_path) and os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    person_content = f.read()
                    content += self.__format_content(reviewer, person_content)

        output_path = os.path.join(self.combine_dir, book_name)
        os.makedirs(output_path, exist_ok=True)

        with open(Parser.join_paths(output_path, file_name), 'w', encoding='utf-8') as f:
            f.write(content)

    def __format_content(self, reviewer, content):
        return f"<details>\n  <summary>{html.escape(reviewer)}</summary>\n  {content}\n</details>"