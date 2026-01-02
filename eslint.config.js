import freaktechnikConfigNode from "@freaktechnik/eslint-config-node";
import freaktechnikConfigTest from "@freaktechnik/eslint-config-test";
import freaktechnikConfigBrowser from "@freaktechnik/eslint-config-browser";
import {
    globalIgnores,
    defineConfig,
} from "eslint/config";

export default defineConfig(
    freaktechnikConfigNode,
    freaktechnikConfigTest,
    {
        files: [ "example/*" ],
        extends: [ freaktechnikConfigBrowser ],
    },
    globalIgnores([ "coverage/*" ]),
);
