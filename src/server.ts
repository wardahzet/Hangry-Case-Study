import connection from "./db";
import { server } from "./routes"

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to database:', err);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});