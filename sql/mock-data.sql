-- authors mock data
INSERT
	INTO
	authors (name)
VALUES 
    ('김철수'),
    ('박영희'),
    ('이민준'),
    ('최수지'),
    ('홍길동'),
    ('정다은'),
    ('강호준'),
    ('윤서영'),
    ('오세훈'),
    ('장예린'),
    ('John Doe'),
    ('Jane Doe'),
    ('Bob Smith'),
    ('Alice Johnson'),
    ('Tom Wilson'),
    ('Sarah Davis'),
    ('Michael Brown'),
    ('Emily Garcia'),
    ('David Hernandez'),
    ('Olivia Sanchez');

-- keywords mock data
INSERT
    INTO
    keywords (keyword, author_id)
VALUES
	('호두', 12),
	('과자', 12),
	('김치', 12),
	('만두', 14),
	('호박', 6),
	('죽', 5),
	('찹쌀떡', 11),
	('강아지', 12),
	('개발자', 1),
	('아이폰', 14),
	('겨울', 15);