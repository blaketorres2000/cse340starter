INSERT 
INTO account (account_firstname, account_lastname, account_email, account_password) 
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account 
SET account_type = 'Admin' 
WHERE account_id = 1;

DELETE 
FROM account 
WHERE account_id = 1;

UPDATE inventory 
SET inv_description = REPLACE(inv_description,'the small interior', 'a huge interior') 
WHERE inv_model = 'Hummer';

SELECT inventory.inv_make, inventory.inv_model, classification.classification_name 
FROM inventory 
INNER JOIN classification 
ON inventory.classification_id = classification.classification_id 
WHERE classification.classification_name = 'Sport';

UPDATE inventory
SET inv_image = CONCAT(SUBSTRING(inv_image, 1, 7), '/vehicles', SUBSTRING(inv_image, 8)),
    inv_thumbnail = CONCAT(SUBSTRING(inv_thumbnail, 1, 7), '/vehicles', SUBSTRING(inv_thumbnail, 8));
