SELECT inventory.inv_make, inventory.inv_model, classification.classification_name FROM inventory INNER JOIN classification ON inventory.classification_id = classification.classification_id WHERE classification.classification_name = 'Sport';