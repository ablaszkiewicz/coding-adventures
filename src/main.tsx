import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Menu } from "./menu/Menu";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QuadTree } from "./quad-tree/QuadTree";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Menu />,
        },
        {
            path: "/quad-tree",
            element: <QuadTree />,
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
