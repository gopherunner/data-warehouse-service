# Marketing DataWarehouse Service

This is the final project of the **Full Stack Developer** track course at Acamica (https://www.acamica.com). It's a service that allows a Marketing company to manage all the contacts of its clients for its campaigns.

The project was coded with the following technologies:

- HTML5
- CSS
- JS
- NodeJS
- Express
- ODM (Mongoose)


# Procedure

### Requirements

1. Install and Configure MongoDB (it will vary between OS)

2. Install NodeJS

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

### Configuration

1. Create an **.env** file inside the **backend** folder with the following configuration:
    ```sh
    APP_PORT=3000
    APP_SECRET=s3cr3t
    DB_URI=mongodb://localhost:27017/warehouse
    ADMIN_PASS=w4r3h0us3
    ```

2. Start the Backend REST API

    ```sh
    cd data-warehouse/backend
    # npm start
    ```
    
    Check that the Backend REST API is working
    ```sh
    [INFO] Connecting to the Database...
    [INFO] Database connected to mongodb://localhost:27017/warehouse
    [INFO] Starting Datawarehouse Mkt API Server, listening on port 3000
    ```
    
3. Once the Backend service is running you could move forward and open the Warehouse Frontend App located at:

   ```sh
   data-warehouse-service/frontend/index.html
   ```
   The system is preloaded with (1) Admin user, with the following credentials:
   
   ```sh
   email:       admin@datawarehouse.com
   password:    w4r3h0us3
   ```
