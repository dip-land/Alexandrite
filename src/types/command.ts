import { applicationCommand } from './applicationCommand'
export type command = {
    data: applicationCommand,
    default: Promise<void>
}