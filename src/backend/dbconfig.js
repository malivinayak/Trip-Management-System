/*  This file is developed for Trip Management System by malivinayak for Advance Database PBL Project
    
******************************************************************
    See the License for the specific language governing permissions and
    limitations under the License.
    
* NAME
    * dbconfig.js

* DESCRIPTION
    * Holds the credentials used by node - oracledb examples to connect to the database.

* Reference
    * https://github.com/oracle/node-oracledb/blob/main/examples/dbconfig.js
    
* TROUBLESHOOTING
    * Errors like:
        ORA-12541: TNS:no listener
        or
        ORA-12154: TNS:could not resolve the connect identifier specified
        indicate connectString is invalid.

    * The error:
        ORA-12514: TNS:listener does not currently know of requested in connect descriptor indicates connectString is invalid.  You are reaching a computer with Oracle installed but the service name isn't known. 
        Use 'lsnrctl services' on the database server to find available services
        if service is not started then Use `lsnrctl start`
*/

import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT
};

export { dbConfig }