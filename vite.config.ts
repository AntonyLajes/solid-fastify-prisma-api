import { defineConfig } from 'vitest/config'
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
    plugins: [
        tsConfigPaths()
    ],
    test: {
        workspace: [
            {
                extends: true,
                test: {
                    environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
                    include: ['src/http/controllers/**/*.spec.ts'],
                    name: 'e2e'
                }   
            },
            {
                extends: true,
                test: {
                    environment: 'node',
                    include: ['src/use-cases/**/*.spec.ts'],
                    name: 'unit',
                }   
            },
        ],
    }
})

