declare namespace SocketIOClient { 
    interface Socket {
        /**
         * Configs socket to the given channel.
         * @param name 
         * @returns this
         */
        channel(name: string): this,

        /**
         * Sends socket request.
         * @param name
         * @param args
         * @returns Promise resolving with the request result
         */
        request(name: string, ...args: any[]): Promise<any>
    }
}
