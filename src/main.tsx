import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { App } from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
        },
        {
            path: "/quad-tree",
            element: <App />,
        },
    ],
    { basename: "/coding-adventures" }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ChakraProvider
        theme={extendTheme({
            config: {
                initialColorMode: "dark",
            },
        })}
    >
        <RouterProvider router={router} />
    </ChakraProvider>
);
