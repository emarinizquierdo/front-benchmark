SELECT
	mt1.BatchId,
    mt1.url as inicio,
    mt2.url as fin,
	mt2.time - mt1.time AS diferencia   
FROM
	Table1 mt1
	LEFT JOIN Table1 mt2
		ON (
             mt2.url = 'bbva_inicio'
          OR mt2.url = 'ksni_inicio'
        )

WHERE mt1.url = 'ksni_inicio'
AND mt1.url != mt2.url
AND mt1.BatchId = mt2.BatchId


SELECT 
  mt1.repository_url as inicio, 
  mt2.repository_url as fin,
  AVG(mt2.repository_size - mt1.repository_size) as diferencia

  FROM (
    SELECT * FROM [publicdata:samples.github_timeline] WHERE  
    repository_url = 'https://github.com/pfarq/llvm' OR repository_url = 'https://github.com/majek/puka'
  ) as mt1

CROSS JOIN (
  SELECT * FROM [publicdata:samples.github_timeline] WHERE  
    repository_url = 'https://github.com/pfarq/llvm' OR repository_url = 'https://github.com/majek/puka'
    ) as mt2
    
WHERE  
    mt1.repository_url != mt2.repository_url
    AND ( mt1.repository_url = 'https://github.com/pfarq/llvm' OR mt1.repository_url = 'https://github.com/majek/puka')

GROUP BY inicio,fin
    