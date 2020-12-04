# MKT Data Warehouse Service

This is the last project of the Full Stack Developer course at Acamica.

# Procedure

### Installation

1. Clone the repo
    ```sh
   git clone https://github.com/gopherunner/data-warehouse-service.git
   ```
2. Install NPM packages
    ```sh
    cd data-warehouse-service/backend/
    npm install
    ```
### Install & configure the MySQL (MariaDB) database (in this example I did it for MacOS)

1. Install MariaDB with Brew:
    ```sh
    brew update
    brew install mariadb
    ```

2. After a successful installation, we can start the server and also ensure it autostarts in the future:
    ```sh
    brew services start mariadb
    ```

3. You should get some feedback from the last command like:
    ```sh
    ==> Successfully started `mariadb` (label: ...)
    ```

4. You must change the root password and secure your installation:
    ```sh
    sudo /usr/local/bin/mysql_secure_installation
    ```

5. Create an **.env** file on the root of the project with the following configuration:
    ```sh
    APP_PORT=3000
    APP_SECRET=s3cr3t
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=<password set for mariadb>
    DB_NAME=data_warehouse
    DB_PORT=3306
    ```
6. Import the Mkt Data Warehouse Service Database schemas into the DB:
    ```sh
    cd data-warehouse-service/backend/db
    $ mysql -u root -p#### -h localhost < warehouse.sql
    ```
    NOTE: replace the #### with the password you set for the db

7. Start the Warehouse Backend REST API

    ```sh
    cd data-warehouse-service/backend/
    $ npm start
    ```
    
    Check that the REST API is working
    ```sh
    [INFO] Connecting to the Database (data_warehouse) on port 3306...
    [INFO] Connection established!
    [INFO] Starting DataWarehouse Mkt API Server, listening on port 3000
    ```
8. Open the Warehouse Frontend App located in

    ```sh
    data-warehouse-service/frontend/index.html
    ```
 
