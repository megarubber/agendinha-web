import getUserInfo from "~/server/api/user/getUserInfo";
import { it } from "vitest";

it('should return user base info', async () => {
    await getUserInfo();
});
