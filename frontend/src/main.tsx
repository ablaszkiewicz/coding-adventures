import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Menu } from "./menu/Menu";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { QuadTree } from "./quad-tree/QuadTree";
import { RayTracing } from "./ray-tracing/RayTracing";

const router = createHashRouter([
    {
        path: "/",
        element: <Menu />,
    },
    {
        path: "/quad-tree",
        element: <QuadTree />,
    },
    {
        path: "/ray-tracing",
        element: <RayTracing />,
    },
]);

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
