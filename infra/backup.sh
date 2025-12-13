#!/bin/bash

# PostgreSQL Backup Script
# Usage: ./backup.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/ecommerce_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
docker exec ecommerce-db pg_dump -U ecommerce ecommerce_db > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "Backup completed: ${BACKUP_FILE}.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
