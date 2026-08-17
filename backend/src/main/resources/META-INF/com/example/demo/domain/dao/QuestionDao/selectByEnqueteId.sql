select
  /*%expand*/*
from
  question
where
  enquete_id = /* enqueteId */0
order by
  question_number
