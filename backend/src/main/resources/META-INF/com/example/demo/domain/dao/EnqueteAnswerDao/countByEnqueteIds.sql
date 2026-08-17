select
  enquete_id, count(*) as answer_count
from
  enquete_answer
where
  enquete_id in /* enqueteIds */(0)
group by
  enquete_id
