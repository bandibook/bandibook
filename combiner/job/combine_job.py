import os
from combiner.service.combiner import Combiner
from combiner.utils.parser import Parser

class CombineJob:
    def __init__(self, individual_study_dir, combine_dir, cache_file):
        self.individual_study_dir = individual_study_dir
        self.combine_dir = combine_dir
        self.combiner = Combiner(individual_study_dir, combine_dir, cache_file)

    def run(self):
        book_names = Parser.find_all_directories(self.individual_study_dir)

        for book_name in book_names:
            book_reviews_path = Parser.join_paths(self.individual_study_dir, book_name)
            reviewer_count = len(Parser.find_all_directories(book_reviews_path))
            all_finished_files = Parser.find_common_files(book_reviews_path)

            self.combiner.combine(all_finished_files, book_reviews_path, book_name, reviewer_count)
