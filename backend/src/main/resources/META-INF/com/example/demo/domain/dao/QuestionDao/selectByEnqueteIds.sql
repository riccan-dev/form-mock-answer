select
  /*%expand*/*
from
  question
where
  enquete_id in /* enqueteIds */(0)
order by
  enquete_id, question_number
