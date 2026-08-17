select
  /*%expand*/*
from
  choice
where
  question_id in /* questionIds */(0)
order by
  question_id, choice_number
