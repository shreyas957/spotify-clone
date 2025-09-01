DELIMITER $$

CREATE PROCEDURE get_user_wishlist_tracks(IN p_user_id BIGINT)
BEGIN
    SELECT track_id
    FROM wishlist
    WHERE user_id = p_user_id;
END$$

DELIMITER ;