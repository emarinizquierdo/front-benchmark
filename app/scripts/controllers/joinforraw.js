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