select
  /*%expand*/*
from
  question_answer
where
  question_id = /* questionId */0
order by
  question_answer_id
