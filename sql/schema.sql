-- 회원
CREATE TABLE authors (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- 게시판
CREATE TABLE posts (
	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	content TEXT NOT NULL,
	author_id INT NOT NULL,
	password VARCHAR(255) NOT NULL,
    salt VARCHAR(50) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL,
	FOREIGN KEY (author_id) REFERENCES authors(id)
);

-- 댓글
CREATE TABLE comments (
	id INT AUTO_INCREMENT PRIMARY KEY,
	content TEXT NOT NULL,
	author_id INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL,
	post_id INT NOT NULL,
	parent_comment_id INT DEFAULT NULL,
	FOREIGN KEY (author_id) REFERENCES authors(id),
	FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id)	
);

-- 키워드
CREATE TABLE keywords (
	id INT AUTO_INCREMENT PRIMARY KEY,
	keyword VARCHAR(50) NOT NULL,
	author_id INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,
	FOREIGN KEY (author_id) REFERENCES authors(id)
);

-- 알림
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,
    keyword_id INT NOT NULL,
    content_type ENUM('post', 'comment') NOT NULL,
    post_id INT,
    comment_id INT,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (recipient_id) REFERENCES authors(id),
    FOREIGN KEY (keyword_id) REFERENCES keywords(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    CONSTRAINT chk_content_type CHECK (
        (content_type = 'post' AND post_id IS NOT NULL AND comment_id IS NULL) OR
        (content_type = 'comment' AND comment_id IS NOT NULL AND post_id IS NULL)
    )
);