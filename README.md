# Lobi: Streamlining the Badminton Game Experience

Demo site: [lobi.jonaswong.dev](https://lobi.jonaswong.dev)
![](https://res.cloudinary.com/ds1s8ilcc/image/upload/v1709782140/Devsite/lobi/lobi-main_qnctkr.png)

Lobi is a web application that aims to simplify the process of organising and finding badminton games in Singapore. It serves as a centralised platform for both game organisers and players, eliminating the need for scattered communication channels and redundant data.

> #### Frontend Stack:
>
> - React
> - Next.js
> - Jotai
> - Sass, CSS modules, shadcn, Tailwind
> - Framer motion
> - Zod
>
> #### Backend Stack:
>
> - Bun
> - Hono
> - MongoDB with Node Driver

## The problem

The badminton scene in Singapore is thriving, with thousands of games played monthly. However, organizers and players face several challenges:

> - **Organizers** have to broadcast game information across various channels like Facebook groups, WhatsApp, and Telegram, often resorting to spamming to reach potential participants.
> - **Players** must join multiple networks and group chats, constantly sifting through redundant data to find suitable games.
>   This cumbersome process leads to frustration and inefficiency for both parties.

## Goal

Lobi aims to resolve these pain points by consolidating game details into a standardized format, allowing for simple and straightforward searches. By providing a centralized platform, Lobi eliminates the need for organizers to spam and enables players to easily find games that match their preferences.

## Intuitive search filters

The key factors players consider when looking for games are date and time, location, and skill level. Lobi offers a seamless search experience by incorporating intuitive filters for these criteria.
Leveraging [shadcn](https://ui.shadcn.com)'s elegant UI component collection, Lobi integrates a calendar, dropdown menus, and combo boxes, allowing users to effortlessly specify their desired game parameters.

![](https://res.cloudinary.com/ds1s8ilcc/image/upload/v1709791072/Devsite/lobi/Lobi-UIs_knexse.png)

## URL embedded search queries

Lobi's search filters are designed to be URL-embeddable, allowing users to share their search queries with others or save them for future re-use. This feature is particularly useful for organisers who can easily share game details with potential participants. For example, a facility organizer can create a URL that filters for games on a specific facility, then share it across various platforms.

Try it: [Demo site with embedded search queries](https://lobi.jonaswong.dev/?facilities=650525c7f4d936033e4f8847&skillLevels=Beginner%2CIntermediate%2CAdvanced%2CExpert&page=1)

![](https://res.cloudinary.com/ds1s8ilcc/image/upload/v1709791506/Devsite/lobi/lobi-url02_dmvzbx.png)

## Game details at a glance

Available games are displayed in a card format, akin to a bulletin board. Each card prominently showcases the essential details: date and time, location, and skill levels. Users can quickly identify suitable games and easily copy the host's contact information with a single click.

![](https://res.cloudinary.com/ds1s8ilcc/image/upload/c_scale,w_1000/v1709782127/Devsite/lobi/lobi-game01_ykl2ut.png)

## Backend

On the backend, Lobi utilizes the cutting-edge [Bun](https://bun.sh/) runtime, which is compatible with most Node.js libraries while offering improved performance and reduced overhead. API routing is handled using [Hono](https://hono.dev), and MongoDB serves as the database.

### Embracing the Native MongoDB Driver

Unlike Lobi's previous project, Blocks, where the Mongoose ORM was used, this time around, the native MongoDB driver is employed. By working directly with the driver, Lobi achieves faster searches and reduced server overhead due to less abstraction.

Example of a custom match statement generated in the server:

![](https://res.cloudinary.com/ds1s8ilcc/image/upload/v1709802570/Devsite/lobi/lobi-mongodriver01_ozucvi.png)

Thank you for reading! If you'd like to see more, check out my next project [Menu'd](https://github.com/jns-w/menud) where I built an app-like web page using react and pure css.
