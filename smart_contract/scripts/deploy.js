async function main() {
    const HonorToken = await ethers.getContractFactory("SoulboundToken");
    const honorToken = await HonorToken.deploy("Honor Token", "HONOR");

    const DishonorToken = await ethers.getContractFactory("SoulboundToken");
    const dishonorToken = await DishonorToken.deploy("Dishonor Token", "DISHONOR");

    console.log("Honor Token deployed to:", honorToken.address);
    console.log("Dishonor Token deployed to:", dishonorToken.address);

    const HonorDAO = await ethers.getContractFactory("HonorDAO");
    const dao = await HonorDAO.deploy(honorToken.address, dishonorToken.address);
    console.log("HonorDAO deployed to:", dao.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});