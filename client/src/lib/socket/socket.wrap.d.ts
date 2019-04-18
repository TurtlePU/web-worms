declare namespace SocketIOClient { 
    interface Socket {
        /**
         * Configs socket to the given channel.
         * @param name - name of a channel
         * @returns this
         */
        channel(name: string): this,

        /**
         * Sends event to everyone in the main room via preconfigged channel.
         * @param event - name of an event
         * @param args - any params of event
         * @returns this
         */
        cast(event: string, ...args: any[]): this,

        /**
         * Listens to an event broadcasted via preconfigged channel from main room.
         * @param event - name of an event
         * @param fn - event handler
         * @returns this
         */
        onCast(event: string, fn: Function): SocketIOClient.Emitter,

        /**
         * Sends socket request via preconfigged channel.
         * @param request - request name
         * @param args - any params of request
         * @returns Promise resolving with the request result
         */
        request(request: string, ...args: any[]): Promise<any>
    }
}
