var upgs = {
    // point upgs
    u1: {
        p_cost() {return new MetaNum(20)},

        boost() {return 2},
        unlockedIf() {return you.started},
        max() {return 1},
        type: 0, // 0: generic, 1: boost-dependent
    },
    u2: {
        p_cost() {return new MetaNum(45)},

        boost() {return 1.5},
        unlockedIf() {return you.upgs.u1 >= 1},
        max() {return 1},
        type: 0
    },
    u3: {
        p_cost() {
            let l = you.upgs.u3||0
            let v = you.upgs.u20||0
            if (l < 5) {
                // 75*1.5^lvl (0-4)
                return new MetaNum(75).mul(1.5**l).div(8**v).floor()
            } else if (l < 45) {
                // 500*2.5^(lvl-5) (5-44)
                return new MetaNum(500).mul(2.5**(l-5)).div(8**v).floor()
            }
            return new MetaNum(67)
        },

        boost() {
            let c = 0.1
            if (you.upgs.u18 >= 1) c += 0.05
            if (you.upgs.u25 >= 1) c += 1.25
            return c*(you.upgs.u3 || 0)
        },
        unlockedIf() {return you.upgs.u2 >= 1},
        max() {return 5 + (you.upgs.u12 >= 1 ? 10 : 0) + (you.upgs.u18 >= 1 ? 35 : 0)},
        type: 0
    },
    u4: {
        p_cost() {
            if (you.upgs.u4 >= 2) return MetaNum(2100).mul(12.5**((you.upgs.u4||0)-2))
            if (you.upgs.u4 == 1) return MetaNum(700)
            return new MetaNum(140)
        },

        boost() {
            return 1.6 + (you.upgs.u4||0) * 0.8
        },
        unlockedIf() {return you.upgs.u2 >= 1},
        max() {return 2 + (you.upgs.b2 >= 1 ? 1 : 0) + (you.upgs.u19 >= 1 ? 15 : 0)},
        type: 0
    },
    u5: {
        p_cost() {return new MetaNum(230)},

        boost() {return 0.2},
        unlockedIf() {return you.upgs.u4 >= 1},
        max() {return 1},
        type: 0
    },
    u6: {
        p_cost() {return new MetaNum(400)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u5 >= 1},
        max() {return 1},
        type: 0
    },
    u7: {
        p_cost() {return new MetaNum(800)},

        boost() {return 0.3},
        unlockedIf() {return you.upgs.u6 >= 1},
        max() {return 1},
        type: 0
    },
    u8: {
        p_cost() {return new MetaNum(1500)},

        boost() {
            let l = 10
            let d = 4
            if (you.upgs.u13 >= 1) {l = 5; d = 3}
            if (you.upgs.n13 >= 1) {l -= 3}

            return you.points.log(l).div(d).add(1).max(1)
        },
        unlockedIf() {return you.upgs.u7 >= 1},
        max() {return 1},
        type: 1
    },
    u9: {
        p_cost() {return new MetaNum(3500)},

        boost() {return [1.4, 0.25]},
        unlockedIf() {return you.upgs.u8 >= 1},
        max() {return 1},
        type: 0
    },
    u10: {
        p_cost() {return new MetaNum(6000)},

        boost() {return 1.25},
        unlockedIf() {return you.upgs.u9 >= 1},
        max() {return 1},
        type: 0
    },

    u11: {
        p_cost() {return new MetaNum(12500)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u5 >= 1 && you.upgs.b3 >= 1},
        max() {return 1},
        type: 0
    },
    u12: {
        p_cost() {return new MetaNum(30000)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u7 >= 1 && you.upgs.b3 >= 1},
        max() {return 1},
        type: 0
    },
    u13: {
        p_cost() {return new MetaNum(75000)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u8 >= 1 && you.upgs.b3 >= 1},
        max() {return 1},
        type: 0
    },
    u14: {
        p_cost() {return new MetaNum(300000)},

        boost() {
            let v = you.bpoints
            if (you.upgs.u21 >= 1) v = v.mul(you.neat_comp.pow(1.15).max(1))
            return v.add(2).root(10).sub(1).max(0)
        },
        unlockedIf() {return you.upgs.u10 >= 1 && you.upgs.b3 >= 1},
        max() {return 1},
        type: 2
    },
    u15: {
        p_cost() {return new MetaNum(1.4e6)},

        boost() {return 1.75},
        unlockedIf() {return you.upgs.u10 >= 1 && you.upgs.b3 >= 1},
        max() {return 1},
        type: 0
    },
    u16: {
        p_cost() {return new MetaNum(20e6)},

        boost() {return 4},
        unlockedIf() {return you.upgs.u14 >= 1},
        max() {return 1},
        type: 0
    },
    u17: {
        p_cost() {return new MetaNum(600e6)},

        boost() {return [2, 1.25, 1.5]},
        unlockedIf() {return you.upgs.u15 >= 1},
        max() {return 1},
        type: 0
    },
    u18: {
        p_cost() {return new MetaNum(8e9)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u12 >= 1},
        max() {return 1},
        type: 0
    },
    u19: {
        p_cost() {return new MetaNum(400e9)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u18 >= 1},
        max() {return 1},
        type: 0
    },
    u20: {
        p_cost() {return new MetaNum(5e12).mul(7.5**(you.upgs.u20||0))},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u18 >= 1},
        max() {return 10},
        type: 0
    },

    u21: {
        p_cost() {return new MetaNum(1.33e15)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u17 >= 1},
        max() {return 1},
        type: 0
    },
    u22: {
        p_cost() {return new MetaNum(450e15)},

        boost() {return [5.5, 2.5]},
        unlockedIf() {return you.upgs.u21 >= 1},
        max() {return 1},
        type: 0
    },
    u23: {
        p_cost() {return new MetaNum(12.25e18)},

        boost() {return you.u23_timer**0.6+1},
        unlockedIf() {return you.upgs.u22 >= 1},
        max() {return 1},
        type: 1
    },
    u24: {
        p_cost() {return new MetaNum(4e21)},

        boost() {return 50},
        unlockedIf() {return you.upgs.u23 >= 1},
        max() {return 1},
        type: 0
    },
    u25: {
        p_cost() {return new MetaNum(1.4e24)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.u23 >= 1},
        max() {return 1},
        type: 0
    },

    // bpoint upgs
    b1: {
        bp_cost() {return new MetaNum(1)},
        
        boost() {return 2.5},
        unlockedIf() {return you.upgs.u10 >= 1 || you.bpoints.neq(0)},
        max() {return 1},
        type: 0
    },
    b2: {
        bp_cost() {return new MetaNum(1.5)},
        
        boost() {return 0.4},
        unlockedIf() {return you.upgs.b1 >= 1},
        max() {return 1},
        type: 0
    },
    b3: {
        bp_cost() {return new MetaNum(2)},
        
        boost() {return undefined},
        unlockedIf() {return you.upgs.b2 >= 1},
        max() {return 1},
        type: 0
    },
    b4: {
        bp_cost() {
            let l = you.upgs.b4||0
            if (l >= 25) return new MetaNum(51).mul(1.215**(l-24)).floor()
            return new MetaNum(3).add(2*l)
        },
        
        boost() {return [1+0.5*(you.upgs.b4||0), 1+0.25*(you.upgs.b4||0)]},
        unlockedIf() {return you.upgs.b3 >= 1},
        max() {return 25 + (you.upgs.n8 >= 1 ? 50 : 0)},
        type: 0
    },
    b5: {
        bp_cost() {return new MetaNum(5).mul(2**(you.upgs.b5||0))},
        
        boost() {return 1.5**(you.upgs.b5||0)},
        unlockedIf() {return you.upgs.b3 >= 1},
        max() {return 5},
        type: 0
    },
    b6: {
        bp_cost() {return new MetaNum(9)},
        
        boost() {return undefined},
        unlockedIf() {return you.upgs.b4 >= 1},
        max() {return 1},
        type: 0
    },
    b7: {
        bp_cost() {return new MetaNum(17)},
        
        boost() {return undefined},
        unlockedIf() {return you.upgs.b6 >= 1},
        max() {return 1},
        type: 0
    },
    b8: {
        bp_cost() {return new MetaNum(35)},
        
        boost() {return [0.5, -0.3, 1.75]},
        unlockedIf() {return you.upgs.b6 >= 1},
        max() {return 1},
        type: 0
    },
    b9: {
        bp_cost() {return new MetaNum(90)},
        
        boost() {return 0.6},
        unlockedIf() {return you.upgs.b7 >= 1},
        max() {return 1},
        type: 0
    },
    b10: {
        bp_cost() {return new MetaNum(225)},
        
        boost() {return Math.max(larp(1, 5, you.b10_timer / 30), 1)},
        unlockedIf() {return you.upgs.b9 >= 1},
        max() {return 1},
        type: 1
    },
    b11: {
        bp_cost() {return new MetaNum(1000)},
        
        boost() {return undefined},
        unlockedIf() {return you.upgs.b10 >= 1},
        max() {return 1},
        type: 0
    },
    b12: {
        bp_cost() {return new MetaNum(15000)},
        
        boost() {return you.bpoints.div(1000).add(1).pow(0.3)},
        unlockedIf() {return you.upgs.b11 >= 1},
        max() {return 1},
        type: 1
    },
    b13: {
        bp_cost() {return new MetaNum(175000)},
        
        boost() {return [15, 4]},
        unlockedIf() {return you.upgs.b11 >= 1},
        max() {return 1},
        type: 0
    },

    // neat upgs
    n1: {
        n_cost() {return new MetaNum(3)},

        boost() {return 2},
        unlockedIf() {return you.upgs.b7 >= 1},
        max() {return 1},
        type: 0
    },
    n2: {
        n_cost() {return new MetaNum(9).mul(2.75**(you.upgs.n2||0)).floor()},

        boost() {return 20*2.5**((you.upgs.n2||0)-1)},
        unlockedIf() {return you.upgs.n1 >= 1},
        max() {return 20},
        type: 0
    },
    n3: {
        n_cost() {return new MetaNum(20)},

        boost() {return you.upgs.n14 >= 1 ? 3 : 1.4},
        unlockedIf() {return you.upgs.n1 >= 1},
        max() {return 1},
        type: 0
    },
    n4: {
        n_cost() {return new MetaNum(50)},

        boost() {
            if (you.upgs.n9 >= 1) return you.points.add(1).pow(0.045).max(1)
            return you.points.add(1).pow(0.02).max(1)
        },
        unlockedIf() {return you.upgs.n2 >= 1},
        max() {return 1},
        type: 3
    },
    n5: {
        n_cost() {return new MetaNum(150)},

        boost() {
            if (you.upgs.n9 >= 1) return you.neat_comp.add(1).pow(0.075).max(1)
            return you.neat_comp.add(1).pow(0.05).max(1)
        },
        unlockedIf() {return you.upgs.n3 >= 1},
        max() {return 1},
        type: 4
    },
    n6: {
        n_cost() {return new MetaNum(325)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.n4 >= 1 && you.upgs.n5 >= 1},
        max() {return 1},
        type: 0
    },
    n7: {
        n_cost() {return new MetaNum(850)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.n6 >= 1},
        max() {return 1},
        type: 0
    },
    n8: {
        n_cost() {return new MetaNum(1750)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.n6 >= 1},
        max() {return 1},
        type: 0
    },
    n9: {
        n_cost() {return new MetaNum(3750)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.n8 >= 1},
        max() {return 1},
        type: 0
    },
    n10: {
        n_cost() {return new MetaNum(8500)},

        boost() {return 2.5},
        unlockedIf() {return you.upgs.n7 >= 1},
        max() {return 1},
        type: 0
    },
    n11: {
        n_cost() {return new MetaNum(20250)},

        boost() {return 0.95**p_upgs}, // not boosted by any currency
        unlockedIf() {return you.upgs.n9 >= 1},
        max() {return 1},
        type: 5
    },
    n12: {
        n_cost() {return new MetaNum(60000).mul(7.5**(you.upgs.n12||0)).floor()},

        boost() {return undefined},
        unlockedIf() {return you.upgs.n10 >= 1},
        max() {return 5},
        type: 0
    },
    n13: {
        n_cost() {return new MetaNum(115000)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.n12 >= 1},
        max() {return 1},
        type: 0
    },
    n14: {
        n_cost() {return new MetaNum(256000)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.n11 >= 1},
        max() {return 1},
        type: 0
    },
    n15: {
        n_cost() {return new MetaNum(550000)},

        boost() {return undefined},
        unlockedIf() {return you.upgs.n14 >= 1},
        max() {return 1},
        type: 0
    },
}