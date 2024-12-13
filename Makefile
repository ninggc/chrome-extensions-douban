EXTENSION_NAME = movie-helper
VERSION = 0.0.1
SRC_DIR = movie-helper
DIST_DIR = build
ZIP_FILE = $(DIST_DIR)/$(EXTENSION_NAME)-$(VERSION).zip

all: clean package

clean:
	rm -rf $(DIST_DIR)
	mkdir -p $(DIST_DIR)

package:
	cd $(SRC_DIR) && zip -r ../$(ZIP_FILE) *

.PHONY: all clean package