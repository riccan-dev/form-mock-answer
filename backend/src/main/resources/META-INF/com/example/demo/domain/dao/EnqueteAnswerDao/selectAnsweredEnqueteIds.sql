select distinct
  enquete_id
from
  enquete_answer
where
  respondent_name = /* respondentName */''
  and enquete_id in /* enqueteIds */(0)
