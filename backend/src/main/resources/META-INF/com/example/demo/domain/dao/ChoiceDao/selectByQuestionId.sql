select
  /*%expand*/*
from
  choice
where
  question_id = /* questionId */0
order by
  choice_number
