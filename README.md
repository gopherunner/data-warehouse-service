# Marketing DataWarehouse Service

This is the final project of the **Full Stack Developer** track at Acamica (https://www.acamica.com). It's a service that allows a Marketing company to manage all the contacts of its clients for its campaigns.

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
    cd data-warehouse-service/backend
    npm start
    ```
    
    Check that the Backend REST API is working
    ```sh
    [INFO] Connecting to the Database...
    [INFO] Database connected to mongodb://localhost:27017/warehouse
    [INFO] Starting Datawarehouse Mkt API Server, listening on port 3000
    ```
    
3. Once the Backend service is running move forward and open the Warehouse Service on Visual Studio Code, then navigate to the **frontend** folder and start the **live server** and finally open the (index.html).

   The system is preloaded with (1) **admin** user, with the following credentials:
   
   ```sh
   email:       admin@datawarehouse.com
   password:    w4r3h0us3
   ```

### Using the Service

1. First, you need to create at least one **Region/Country** and **City**, for that go to the Regions/City menu then create a Region, and for creating a Country and City you will need to click the three dots and follow the instructions.

2. Create a Company, go the Companies menu and click on **Add Company**, complete the fields.

3. Now, you can create **Contacts**.


## Some useful MongoDB commands (install & use) - for MacOS:

- Install MongoDB Community edition:
    ```sh
    $ brew install mongodb-community
    ```

- List services:
    ```sh
    $ brew services list
    ```

- Start MongoDB service:
    ```sh
    $ brew services start mongodb-community
    ```
    
- Run MongoDB command line:
    ```sh
    $ mongo
    ```

- Use specific database:
    ```sh
    > use mydb
    switched to db mydb
    ```

- Show collections (tables in relational language):
    ```sh
    > show collections
    cities
    companies
    contacts
    countries
    regions
    users
    ```

- Show content of **users** collection:
    ```sh
    > db.users.find()
    ```

- Delete database:
    ```sh
    > db.dropDatabase()
    ```

