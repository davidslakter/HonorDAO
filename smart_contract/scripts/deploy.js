async function main() {
    const HonorToken = await ethers.getContractFactory("HonorToken");
    const token = await HonorToken.deploy();
    
    await token.deployed();
    console.log("Honor token deployed to:", token.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});