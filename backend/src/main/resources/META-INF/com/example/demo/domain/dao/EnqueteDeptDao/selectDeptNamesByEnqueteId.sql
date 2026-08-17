select
  d.dept_name
from
  enquete_dept ed
  inner join dept d on ed.dept_id = d.dept_id
where
  ed.enquete_id = /* enqueteId */0
order by
  d.dept_id
