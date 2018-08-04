import app from "./app";
import config from "../config/config";
import {createServer, Server} from "http";

const PORT = config.port;

export const server: Server = createServer(app);

server.listen(PORT, () => {
    console.log('Running server on port %s', this.port);
});
