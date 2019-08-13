-- I assume it's normally print(), like in Roblox.

function recur(iteration)
	recur(iteration + 1)
end

recur(1)