document.addEventListener('DOMContentLoaded', function() {
    
    let currentLang = 'zh';
    const version = '2.0.0'; 

    // --- 1. 翻译文本 ---
    const translations = {
        zh: {
            title: '工程单位换算器',
            category: '选择换算类别：',
            input: '输入数值：',
            result: '换算结果：',
            selectConstant: '选择常数：', 
            constantValue: '常数值：', 
            langToggle: 'English',
            version: '版本',
            author: '编者',
            unitNone: '无单位',
            selectFuel: '选择燃料：',
            dataSource: '数据来源：GB/T 32151.10—2023（国家标准，不可更改）'
        },
        en: {
            title: 'Engineering Unit Converter',
            category: 'Select Category:',
            input: 'Input Value:',
            result: 'Result:',
            selectConstant: 'Select Constant:', 
            constantValue: 'Constant Value:', 
            langToggle: '中文',
            version: 'Version',
            author: 'Editor',
            unitNone: 'Dimensionless',
            selectFuel: 'Select Fuel:',
            dataSource: 'Data Source: GB/T 32151.10—2023 (National Standard, Fixed)',
            standardValues: '国家标准规定值：'
        },
        en: {
            title: 'Engineering Unit Converter',
            category: 'Select Category:',
            input: 'Input Value:',
            result: 'Result:',
            selectConstant: 'Select Constant:', 
            constantValue: 'Constant Value:', 
            langToggle: '中文',
            version: 'Version',
            author: 'Editor',
            unitNone: 'Dimensionless',
            selectFuel: 'Select Fuel:',
            dataSource: 'Data Source: GB/T 32151.10—2023 (National Standard, Fixed)',
            standardValues: 'National Standard Values:'
        }
    };

    // --- 2. 单位定义 (支持中英文) ---
    const units = {
        // === RO水/水质 ===
        water_quality: {
            name: { zh: '水质 (电导/电阻/TDS)', en: 'Water Quality (Cond/Res/TDS)' },
            // 特殊逻辑：不使用 standard factor，而是自定义函数处理倒数关系
            list: {
                'us_cm': { name: { zh: '微西门子/cm (μS/cm)', en: 'Microsiemens/cm (μS/cm)' }, type: 'cond', factor: 1 },
                'ms_cm': { name: { zh: '毫西门子/cm (mS/cm)', en: 'Millisiemens/cm (mS/cm)' }, type: 'cond', factor: 1000 },
                's_m': { name: { zh: '西门子/米 (S/m)', en: 'Siemens/meter (S/m)' }, type: 'cond', factor: 10000 },
                'tds_ppm': { name: { zh: 'TDS (ppm, 估算值)', en: 'TDS (ppm, approx)' }, type: 'cond', factor: 0.5 }, // 假设 0.5 转换系数
                'meg_ohm': { name: { zh: '兆欧·厘米 (MΩ·cm)', en: 'Megaohm-cm (MΩ·cm)' }, type: 'res', factor: 1 }, // 基准电阻率单位
                'k_ohm': { name: { zh: '千欧·厘米 (kΩ·cm)', en: 'Kiloohm-cm (kΩ·cm)' }, type: 'res', factor: 0.001 },
                'ohm_cm': { name: { zh: '欧姆·厘米 (Ω·cm)', en: 'Ohm-cm (Ω·cm)' }, type: 'res', factor: 0.000001 }
            }
        },
        temperature: {
            name: { zh: '温度', en: 'Temperature' },
            baseUnit: 'celsius',
            list: {
                celsius: { name: { zh: '摄氏度 (°C)', en: 'Celsius (°C)' } },
                fahrenheit: { name: { zh: '华氏度 (°F)', en: 'Fahrenheit (°F)' } },
                kelvin: { name: { zh: '开尔文 (K)', en: 'Kelvin (K)' } },
            }
        },
        pressure: {
            name: { zh: '压力 (制冷常用)', en: 'Pressure (HVAC/R)' },
            baseUnit: 'pascal',
            list: {
                pascal: { name: { zh: '帕斯卡 (Pa)', en: 'Pascal (Pa)' }, factor: 1 },
                kilopascal: { name: { zh: '千帕 (kPa)', en: 'Kilopascal (kPa)' }, factor: 1000 },
                megapascal: { name: { zh: '兆帕 (MPa)', en: 'Megapascal (MPa)' }, factor: 1000000 },
                bar: { name: { zh: '巴 (bar)', en: 'Bar (bar)' }, factor: 100000 },
                mbar: { name: { zh: '毫巴 (mbar)', en: 'Millibar (mbar)' }, factor: 100 },
                psi: { name: { zh: '磅/平方英寸 (psi)', en: 'Pounds/sq inch (psi)' }, factor: 6894.757 },
                atm: { name: { zh: '标准大气压 (atm)', en: 'Atmosphere (atm)' }, factor: 101325 },
                mmHg: { name: { zh: '毫米汞柱 (mmHg)', en: 'Millimeter of mercury (mmHg)' }, factor: 133.322 },
                inHg: { name: { zh: '英寸汞柱 (inHg)', en: 'Inch of mercury (inHg)' }, factor: 3386.389 },
                kgf_cm2: { name: { zh: '公斤力/平方厘米 (kgf/cm²)', en: 'Kilogram-force/sq cm (kgf/cm²)' }, factor: 98066.5 },
            }
        },
        power: {
            name: { zh: '功率 (制冷量)', en: 'Power (Refrigeration)' },
            baseUnit: 'watt',
            list: {
                watt: { name: { zh: '瓦 (W)', en: 'Watt (W)' }, factor: 1 },
                kilowatt: { name: { zh: '千瓦 (kW)', en: 'Kilowatt (kW)' }, factor: 1000 },
                megawatt: { name: { zh: '兆瓦 (MW)', en: 'Megawatt (MW)' }, factor: 1000000 },
                gigawatt: { name: { zh: '吉瓦 (GW)', en: 'Gigawatt (GW)' }, factor: 1000000000 },
                terawatt: { name: { zh: '太瓦 (TW)', en: 'Terawatt (TW)' }, factor: 1000000000000 },
                'btu_hr': { name: { zh: '英热单位/小时 (BTU/hr)', en: 'BTU/hour (BTU/hr)' }, factor: 0.293071 },
                'ton_refrigeration': { name: { zh: '美制冷吨 (TR)', en: 'US Ton (TR)' }, factor: 3516.853 },
                'kcal_hr': { name: { zh: '千卡/小时 (kcal/h)', en: 'Kilocalorie/hour (kcal/h)' }, factor: 1.163 },
                'hp': { name: { zh: '马力 (HP, 电机)', en: 'Horsepower (HP, electric)' }, factor: 745.7 }
            }
        },
        energy: {
            name: { zh: '能量 (热值)', en: 'Energy (Heating)' },
            baseUnit: 'joule',
            list: {
                'joule': { name: { zh: '焦耳 (J)', en: 'Joule (J)' }, factor: 1 },
                'kilojoule': { name: { zh: '千焦 (kJ)', en: 'Kilojoule (kJ)' }, factor: 1000 },
                'megajoule': { name: { zh: '兆焦 (MJ)', en: 'Megajoule (MJ)' }, factor: 1000000 },
                'gigajoule': { name: { zh: '吉焦 (GJ)', en: 'Gigajoule (GJ)' }, factor: 1000000000 },
                'terajoule': { name: { zh: '太焦 (TJ)', en: 'Terajoule (TJ)' }, factor: 1000000000000 },
                'kwh': { name: { zh: '千瓦时 (kW·h)', en: 'Kilowatt-hour (kW·h)' }, factor: 3600000 },
                'calorie': { name: { zh: '卡 (cal)', en: 'Calorie (cal)' }, factor: 4.184 },
                'kilocalorie': { name: { zh: '千卡 (kcal)', en: 'Kilocalorie (kcal)' }, factor: 4184 },
                'btu': { name: { zh: '英热单位 (BTU)', en: 'British Thermal Unit (BTU)' }, factor: 1055.056 },
            }
        },
        // === 常用燃料热值转换 ===
        // 数据来源：GB/T 32151.10—2023《温室气体排放核算与报告要求 第10部分：化工生产企业》
        // 注：以下数据为国家标准规定的常用值，不可更改
        fuel_heat_value: {
            name: { zh: '常用燃料热值', en: 'Fuel Heat Value' },
            isFuel: true,
            // 燃料热值数据（低位发热量，国家标准值）
            // 数据来源：GB/T 32151.10—2023 表C.1
            fuels: {
                'natural_gas': { 
                    name: { zh: '天然气', en: 'Natural Gas' }, 
                    heatValueMJkg: 54.3,  // MJ/kg（基于标准密度0.717 kg/m³计算：38.931 / 0.717 ≈ 54.3）
                    heatValueMJm3: 38.931   // MJ/m³ (标准状态，389.31 GJ/10⁴Nm³ = 38.931 MJ/m³，GB/T 32151.10—2023)
                },
                'gasoline': { 
                    name: { zh: '汽油', en: 'Gasoline' }, 
                    heatValueMJkg: 43.070,  // MJ/kg (43.070 GJ/t)
                    heatValueMJL: 31.87     // MJ/L (基于密度约0.74 kg/L计算)
                },
                'diesel': { 
                    name: { zh: '柴油', en: 'Diesel' }, 
                    heatValueMJkg: 42.652,  // MJ/kg (42.652 GJ/t)
                    heatValueMJL: 35.83     // MJ/L (基于密度约0.84 kg/L计算)
                },
                'coal': { 
                    name: { zh: '煤 (标准煤)', en: 'Coal (Standard)' }, 
                    heatValueMJkg: 29.307   // MJ/kg (标准煤热值)
                },
                'lpg': { 
                    name: { zh: '液化石油气 (LPG)', en: 'LPG' }, 
                    heatValueMJkg: 50.179,  // MJ/kg (50.179 GJ/t)
                    heatValueMJL: 27.10     // MJ/L (基于密度约0.54 kg/L计算)
                },
                'lng': { 
                    name: { zh: '液化天然气 (LNG)', en: 'LNG' }, 
                    heatValueMJkg: 51.498,  // MJ/kg (51.498 GJ/t)
                    heatValueMJL: 22.14     // MJ/L (基于密度约0.43 kg/L计算)
                },
                'biomass': { 
                    name: { zh: '生物质', en: 'Biomass' }, 
                    heatValueMJkg: 17.0     // MJ/kg (典型值，14-19 MJ/kg范围)
                },
                'steam': { 
                    name: { zh: '管道蒸汽', en: 'Steam (Piped)' }, 
                    heatValueMJkg: 3.684,   // MJ/kg (蒸汽热值/焓值，GB/T 32151.10—2023标准值，不是生产蒸汽所需能量)
                    heatValueMJm3: 3.684    // MJ/m³ (蒸汽体积热值，近似值)
                },
                'electricity': { 
                    name: { zh: '电力', en: 'Electricity' }, 
                    // 电力没有热值概念，但可以按等价热值处理：1 kWh = 3.6 MJ
                    heatValueMJkg: 0,       // 电力无质量热值
                    heatValueMJm3: 0        // 电力无体积热值
                },
                'hydrogen': { 
                    name: { zh: '氢气', en: 'Hydrogen' }, 
                    heatValueMJkg: 120.1,   // MJ/kg (氢气低位发热量，约33.36 kWh/kg)
                    heatValueMJm3: 10.8     // MJ/m³ (标准状态，基于密度0.0899 kg/m³计算：120.1 × 0.0899 ≈ 10.8)
                }
            },
            // 单位定义（质量单位）
            list: {
                'MJ_kg': { name: { zh: '兆焦/千克 (MJ/kg)', en: 'Megajoule/kilogram (MJ/kg)' }, factor: 1, type: 'mass' },
                'kWh_kg': { name: { zh: '千瓦时/千克 (kWh/kg)', en: 'Kilowatt-hour/kilogram (kWh/kg)' }, factor: 0.2778, type: 'mass' }, // 1 MJ/kg = 0.2778 kWh/kg (1/3.6)
                'kWh_ton': { name: { zh: '千瓦时/吨 (kWh/ton)', en: 'Kilowatt-hour/ton (kWh/ton)' }, factor: 277.78, type: 'mass' }, // 1 MJ/kg = 277.78 kWh/ton (1000/3.6，因为1吨=1000kg，1MJ=1/3.6kWh)
                'BTU_lb': { name: { zh: 'BTU/磅 (BTU/lb)', en: 'BTU/pound (BTU/lb)' }, factor: 2.326, type: 'mass' }, // 1 MJ/kg = 2.326 BTU/lb
                'kcal_kg': { name: { zh: '千卡/千克 (kcal/kg)', en: 'Kilocalorie/kilogram (kcal/kg)' }, factor: 0.239, type: 'mass' }, // 1 MJ/kg = 0.239 kcal/kg
                'MMBTU_ton': { name: { zh: '百万BTU/吨 (MMBTU/ton)', en: 'MMBTU/ton (MMBTU/ton)' }, factor: 0.002326, type: 'mass' },
                // 体积单位（气体）
                'MJ_m3': { name: { zh: '兆焦/立方米 (MJ/m³)', en: 'Megajoule/cubic meter (MJ/m³)' }, factor: 1, type: 'volume_gas' },
                'BTU_ft3': { name: { zh: 'BTU/立方英尺 (BTU/ft³)', en: 'BTU/cubic foot (BTU/ft³)' }, factor: 0.0268, type: 'volume_gas' }, // 1 MJ/m³ ≈ 26.8 BTU/ft³
                'kWh_m3': { name: { zh: '千瓦时/立方米 (kWh/m³)', en: 'Kilowatt-hour/cubic meter (kWh/m³)' }, factor: 0.278, type: 'volume_gas' },
                // 体积单位（液体）
                'MJ_L': { name: { zh: '兆焦/升 (MJ/L)', en: 'Megajoule/liter (MJ/L)' }, factor: 1, type: 'volume_liquid' },
                'BTU_gal': { name: { zh: 'BTU/加仑 (BTU/gal)', en: 'BTU/gallon (BTU/gal)' }, factor: 0.0088, type: 'volume_liquid' } // 1 MJ/L ≈ 880 BTU/gal
            }
        },
        // === 常用燃料碳因子转换 ===
        // 数据来源：GB/T 32151.10—2023《温室气体排放核算与报告要求 第10部分：化工生产企业》
        // 注：以下数据为国家标准规定的常用值，不可更改
        // 计算方法：从单位热值含碳量 (tC/GJ) 计算
        // kg CO₂/MJ = (tC/GJ) × (44/12) = (tC/GJ) × 3.667
        // kg CO₂/kg = (kg CO₂/MJ) × (MJ/kg)
        fuel_carbon_factor: {
            name: { zh: '常用燃料碳因子', en: 'Fuel Carbon Factor' },
            isFuel: true,
            // 燃料碳因子数据（国家标准计算值）
            // 数据来源：GB/T 32151.10—2023 表C.1
            fuels: {
                'natural_gas': { 
                    name: { zh: '天然气', en: 'Natural Gas' }, 
                    carbonFactorEnergy: 0.0561,  // kg CO₂/MJ (0.0153 tC/GJ × 3.667)
                    carbonFactorMass: 2.805      // kg CO₂/kg (0.0561 × 50.0)
                },
                'gasoline': { 
                    name: { zh: '汽油', en: 'Gasoline' }, 
                    carbonFactorEnergy: 0.0693,  // kg CO₂/MJ (0.0189 tC/GJ × 3.667)
                    carbonFactorMass: 2.985     // kg CO₂/kg (0.0693 × 43.070)
                },
                'diesel': { 
                    name: { zh: '柴油', en: 'Diesel' }, 
                    carbonFactorEnergy: 0.0741,  // kg CO₂/MJ (0.0202 tC/GJ × 3.667)
                    carbonFactorMass: 3.161     // kg CO₂/kg (0.0741 × 42.652)
                },
                'coal': { 
                    name: { zh: '煤 (标准煤)', en: 'Coal (Standard)' }, 
                    carbonFactorEnergy: 0.0957,  // kg CO₂/MJ (0.0261 tC/GJ × 3.667，烟煤值)
                    carbonFactorMass: 2.805     // kg CO₂/kg (0.0957 × 29.307)
                },
                'lpg': { 
                    name: { zh: '液化石油气 (LPG)', en: 'LPG' }, 
                    carbonFactorEnergy: 0.0631,  // kg CO₂/MJ (0.0172 tC/GJ × 3.667)
                    carbonFactorMass: 3.166     // kg CO₂/kg (0.0631 × 50.179)
                },
                'lng': { 
                    name: { zh: '液化天然气 (LNG)', en: 'LNG' }, 
                    carbonFactorEnergy: 0.0561,  // kg CO₂/MJ (0.0153 tC/GJ × 3.667)
                    carbonFactorMass: 2.889     // kg CO₂/kg (0.0561 × 51.498)
                },
                'biomass': { 
                    name: { zh: '生物质', en: 'Biomass' }, 
                    carbonFactorEnergy: 0.0,     // kg CO₂/MJ (生物质燃烧通常视为碳中和，但需考虑全生命周期)
                    carbonFactorMass: 0.0        // kg CO₂/kg (生物质燃烧通常视为碳中和)
                },
                'steam': { 
                    name: { zh: '管道蒸汽', en: 'Steam (Piped)' }, 
                    carbonFactorEnergy: 0.11,    // kg CO₂/MJ (0.11 tCO₂/GJ，热力排放因子)
                    carbonFactorMass: 0.405       // kg CO₂/kg (0.11 × 3.684)
                },
                'electricity': { 
                    name: { zh: '电力', en: 'Electricity' }, 
                    carbonFactorEnergy: 0.225,   // kg CO₂/MJ (基于全国电网排放因子约0.81 kg CO₂/kWh，0.81/3.6≈0.225)
                    carbonFactorMass: 0.0        // kg CO₂/kg (电力无质量概念)
                },
                'hydrogen': { 
                    name: { zh: '氢气', en: 'Hydrogen' }, 
                    carbonFactorEnergy: 0.0,     // kg CO₂/MJ (氢气燃烧不产生CO₂)
                    carbonFactorMass: 0.0        // kg CO₂/kg (氢气燃烧不产生CO₂)
                }
            },
            // 单位定义
            list: {
                // 能量单位
                'kg_CO2_MJ': { name: { zh: '千克 CO₂/兆焦 (kg CO₂/MJ)', en: 'kg CO₂/MJ (kg CO₂/MJ)' }, factor: 1, type: 'energy' },
                'kg_CO2_kWh': { name: { zh: '千克 CO₂/千瓦时 (kg CO₂/kWh)', en: 'kg CO₂/kWh (kg CO₂/kWh)' }, factor: 3.6, type: 'energy' }, // 1 MJ = 0.278 kWh, 所以 1 kg CO₂/MJ = 3.6 kg CO₂/kWh
                'kg_CO2_MMBTU': { name: { zh: '千克 CO₂/百万BTU (kg CO₂/MMBTU)', en: 'kg CO₂/MMBTU (kg CO₂/MMBTU)' }, factor: 0.001055, type: 'energy' }, // 1 MMBTU = 1055 MJ
                't_CO2_GJ': { name: { zh: '吨 CO₂/吉焦 (t CO₂/GJ)', en: 't CO₂/GJ (t CO₂/GJ)' }, factor: 0.001, type: 'energy' }, // 1 GJ = 1000 MJ, 1 t = 1000 kg
                // 质量单位
                'kg_CO2_kg': { name: { zh: '千克 CO₂/千克燃料 (kg CO₂/kg)', en: 'kg CO₂/kg fuel (kg CO₂/kg)' }, factor: 1, type: 'mass' },
                't_CO2_t': { name: { zh: '吨 CO₂/吨燃料 (t CO₂/t)', en: 't CO₂/t fuel (t CO₂/t)' }, factor: 0.001, type: 'mass' }
            }
        },
        volumetric_flow: {
            name: { zh: '体积流量 (风量/水流量)', en: 'Volumetric Flow (Air/Water)' },
            baseUnit: 'm3/s',
            list: {
                'm3_s': { name: { zh: '立方米/秒 (m³/s)', en: 'Cubic meter/second (m³/s)' }, factor: 1 },
                'm3_hr': { name: { zh: '立方米/小时 (m³/h)', en: 'Cubic meter/hour (m³/h)' }, factor: 1 / 3600 },
                'L_s': { name: { zh: '升/秒 (L/s)', en: 'Liter/second (L/s)' }, factor: 0.001 },
                'L_min': { name: { zh: '升/分钟 (L/min)', en: 'Liter/minute (L/min)' }, factor: 0.001 / 60 },
                'cfm': { name: { zh: '立方英尺/分钟 (CFM)', en: 'Cubic feet/minute (CFM)' }, factor: 0.000471947 },
                'gpm_us': { name: { zh: '美制加仑/分钟 (US GPM)', en: 'US Gallon/minute (US GPM)' }, factor: 0.00378541 / 60 },
            }
        },
        mass_flow: {
            name: { zh: '质量流量', en: 'Mass Flow' },
            baseUnit: 'kg/s',
            list: {
                'kg_s': { name: { zh: '千克/秒 (kg/s)', en: 'Kilogram/second (kg/s)' }, factor: 1 },
                'kg_hr': { name: { zh: '千克/小时 (kg/h)', en: 'Kilogram/hour (kg/h)' }, factor: 1 / 3600 },
                'ton_hr': { name: { zh: '吨/小时 (t/h, 公制)', en: 'Tonne/hour (t/h, metric)' }, factor: 1000 / 3600 },
                'lb_s': { name: { zh: '磅/秒 (lb/s)', en: 'Pound/second (lb/s)' }, factor: 0.45359237 },
                'lb_min': { name: { zh: '磅/分钟 (lb/min)', en: 'Pound/minute (lb/min)' }, factor: 0.45359237 / 60 },
                'lb_hr': { name: { zh: '磅/小时 (lb/hr)', en: 'Pound/hour (lb/hr)' }, factor: 0.45359237 / 3600 },
            }
        },
        density: {
            name: { zh: '密度', en: 'Density' },
            baseUnit: 'kg/m3',
            list: {
                'kg_m3': { name: { zh: '千克/立方米 (kg/m³)', en: 'Kilogram/cubic meter (kg/m³)' }, factor: 1 },
                'g_cm3': { name: { zh: '克/立方厘米 (g/cm³)', en: 'Gram/cubic centimeter (g/cm³)' }, factor: 1000 },
                'g_L': { name: { zh: '克/升 (g/L)', en: 'Gram/liter (g/L)' }, factor: 1 },
                'lb_ft3': { name: { zh: '磅/立方英尺 (lb/ft³)', en: 'Pound/cubic foot (lb/ft³)' }, factor: 16.01846 },
                'lb_gal_us': { name: { zh: '磅/美制加仑 (lb/gal)', en: 'Pound/US gallon (lb/gal)' }, factor: 119.8264 },
            }
        },
        specific_heat: {
            name: { zh: '比热容', en: 'Specific Heat' },
            baseUnit: 'J/(kg·K)',
            list: {
                'J_kgK': { name: { zh: '焦耳/千克·开尔文 (J/(kg·K))', en: 'Joule/kilogram·kelvin (J/(kg·K))' }, factor: 1 },
                'kJ_kgK': { name: { zh: '千焦/千克·开尔文 (kJ/(kg·K))', en: 'Kilojoule/kilogram·kelvin (kJ/(kg·K))' }, factor: 1000 },
                'kcal_kg_C': { name: { zh: '千卡/千克·°C (kcal/(kg·°C))', en: 'Kilocalorie/kilogram·°C (kcal/(kg·°C))' }, factor: 4186.8 },
                'btu_lb_F': { name: { zh: 'BTU/(lb·°F)', en: 'BTU/(lb·°F)' }, factor: 4186.8 },
            }
        },
        thermal_conductivity: {
            name: { zh: '导热系数', en: 'Thermal Conductivity' },
            baseUnit: 'W/(m·K)',
            list: {
                'W_mK': { name: { zh: '瓦/米·开尔文 (W/(m·K))', en: 'Watt/meter·kelvin (W/(m·K))' }, factor: 1 },
                'kcal_hr_m_C': { name: { zh: '千卡/(hr·m·°C)', en: 'Kilocalorie/(hr·m·°C)' }, factor: 1.163 },
                'btu_hr_ft_F': { name: { zh: 'BTU/(hr·ft·°F)', en: 'BTU/(hr·ft·°F)' }, factor: 1.730735 },
            }
        },
        dynamic_viscosity: {
            name: { zh: '动力粘度', en: 'Dynamic Viscosity' },
            baseUnit: 'pa_s',
            list: {
                'pa_s': { name: { zh: '帕斯卡·秒 (Pa·s)', en: 'Pascal-second (Pa·s)' }, factor: 1 },
                'poise': { name: { zh: '泊 (P)', en: 'Poise (P)' }, factor: 0.1 },
                'centipoise': { name: { zh: '厘泊 (cP)', en: 'Centipoise (cP)' }, factor: 0.001 },
                'lb_ft_s': { name: { zh: '磅/(英尺·秒) (lb/(ft·s))', en: 'Pound/(foot·second) (lb/(ft·s))' }, factor: 1.48816 },
            }
        },
        kinematic_viscosity: {
            name: { zh: '运动粘度', en: 'Kinematic Viscosity' },
            baseUnit: 'm2/s',
            list: {
                'm2_s': { name: { zh: '米²/秒 (m²/s)', en: 'Meter²/second (m²/s)' }, factor: 1 },
                'stokes': { name: { zh: '斯 (St)', en: 'Stokes (St)' }, factor: 0.0001 },
                'centistokes': { name: { zh: '厘斯 (cSt)', en: 'Centistokes (cSt)' }, factor: 0.000001 },
                'ft2_s': { name: { zh: '英尺²/秒 (ft²/s)', en: 'Foot²/second (ft²/s)' }, factor: 0.09290304 },
            }
        },
        speed: {
            name: { zh: '速度', en: 'Speed' },
            baseUnit: 'm/s',
            list: {
                'm_s': { name: { zh: '米/秒 (m/s)', en: 'Meter/second (m/s)' }, factor: 1 },
                'km_h': { name: { zh: '千米/小时 (km/h)', en: 'Kilometer/hour (km/h)' }, factor: 1000 / 3600 },
                'ft_s': { name: { zh: '英尺/秒 (ft/s)', en: 'Foot/second (ft/s)' }, factor: 0.3048 },
                'mph': { name: { zh: '英里/小时 (mph)', en: 'Miles/hour (mph)' }, factor: 1609.344 / 3600 },
                'knot': { name: { zh: '节 (knot)', en: 'Knot (knot)' }, factor: 1852 / 3600 },
            }
        },
        // === 新增：转速 ===
        rotational_speed: {
            name: { zh: '转速/角速度', en: 'Rotational Speed' },
            baseUnit: 'rpm',
            list: {
                'rpm': { name: { zh: '转/分钟 (RPM)', en: 'Revolutions/minute (RPM)' }, factor: 1 },
                'r_s': { name: { zh: '转/秒 (r/s, Hz)', en: 'Revolutions/second (r/s, Hz)' }, factor: 60 },
                'rad_s': { name: { zh: '弧度/秒 (rad/s)', en: 'Radians/second (rad/s)' }, factor: 9.54929658 },
                'deg_s': { name: { zh: '度/秒 (°/s)', en: 'Degrees/second (°/s)' }, factor: 0.16666667 },
            }
        },
        acceleration: {
            name: { zh: '加速度', en: 'Acceleration' },
            baseUnit: 'm/s2',
            list: {
                'm_s2': { name: { zh: '米/秒² (m/s²)', en: 'Meter/second² (m/s²)' }, factor: 1 },
                'km_h_s': { name: { zh: '千米/小时/秒 (km/h/s)', en: 'Kilometer/hour/second (km/h/s)' }, factor: 1000 / 3600 },
                'ft_s2': { name: { zh: '英尺/秒² (ft/s²)', en: 'Foot/second² (ft/s²)' }, factor: 0.3048 },
                'g': { name: { zh: '标准重力 (g)', en: 'Standard gravity (g)' }, factor: 9.80665 },
            }
        },
        length: {
            name: { zh: '长度', en: 'Length' },
            baseUnit: 'meter',
            list: {
                kilometer: { name: { zh: '千米 (km)', en: 'Kilometer (km)' }, factor: 1000 },
                meter: { name: { zh: '米 (m)', en: 'Meter (m)' }, factor: 1 },
                centimeter: { name: { zh: '厘米 (cm)', en: 'Centimeter (cm)' }, factor: 0.01 },
                millimeter: { name: { zh: '毫米 (mm)', en: 'Millimeter (mm)' }, factor: 0.001 },
                si: { name: { zh: '丝 (sī, 0.01mm)', en: 'Si (0.01mm)' }, factor: 1e-5 }, 
                micrometer: { name: { zh: '微米 (μm)', en: 'Micrometer (μm)' }, factor: 1e-6 }, 
                nanometer: { name: { zh: '纳米 (nm)', en: 'Nanometer (nm)' }, factor: 1e-9 }, 
                mile: { name: { zh: '英里 (mi)', en: 'Mile (mi)' }, factor: 1609.344 },
                nautical_mile: { name: { zh: '海里 (nmi)', en: 'Nautical Mile (nmi)' }, factor: 1852 },
                yard: { name: { zh: '码 (yd)', en: 'Yard (yd)' }, factor: 0.9144 },
                foot: { name: { zh: '英尺 (ft)', en: 'Foot (ft)' }, factor: 0.3048 },
                inch: { name: { zh: '英寸 (in)', en: 'Inch (in)' }, factor: 0.0254 }
            }
        },
        mass: {
            name: { zh: '质量', en: 'Mass' },
            baseUnit: 'kilogram',
            list: {
                kilogram: { name: { zh: '千克 (kg)', en: 'Kilogram (kg)' }, factor: 1 },
                gram: { name: { zh: '克 (g)', en: 'Gram (g)' }, factor: 0.001 },
                milligram: { name: { zh: '毫克 (mg)', en: 'Milligram (mg)' }, factor: 0.000001 },
                pound: { name: { zh: '磅 (lb)', en: 'Pound (lb)' }, factor: 0.45359237 },
                ounce: { name: { zh: '盎司 (oz)', en: 'Ounce (oz)' }, factor: 0.02834952 },
            }
        },
        area: {
            name: { zh: '面积', en: 'Area' },
            baseUnit: 'sq_meter',
            list: {
                sq_meter: { name: { zh: '平方米 (m²)', en: 'Square meter (m²)' }, factor: 1 },
                sq_centimeter: { name: { zh: '平方厘米 (cm²)', en: 'Square centimeter (cm²)' }, factor: 0.0001 },
                sq_kilometer: { name: { zh: '平方千米 (km²)', en: 'Square kilometer (km²)' }, factor: 1000000 },
                sq_foot: { name: { zh: '平方英尺 (ft²)', en: 'Square foot (ft²)' }, factor: 0.09290304 },
                sq_inch: { name: { zh: '平方英寸 (in²)', en: 'Square inch (in²)' }, factor: 0.00064516 },
                acre: { name: { zh: '英亩 (acre)', en: 'Acre (acre)' }, factor: 4046.856 },
                hectare: { name: { zh: '公顷 (ha)', en: 'Hectare (ha)' }, factor: 10000 },
            }
        },
        volume: {
            name: { zh: '体积/容积', en: 'Volume' },
            baseUnit: 'cubic_meter',
            list: {
                cubic_meter: { name: { zh: '立方米 (m³)', en: 'Cubic meter (m³)' }, factor: 1 },
                liter: { name: { zh: '升 (L)', en: 'Liter (L)' }, factor: 0.001 },
                milliliter: { name: { zh: '毫升 (mL)', en: 'Milliliter (mL)' }, factor: 0.000001 },
                cubic_foot: { name: { zh: '立方英尺 (ft³)', en: 'Cubic foot (ft³)' }, factor: 0.02831685 },
                cubic_inch: { name: { zh: '立方英寸 (in³)', en: 'Cubic inch (in³)' }, factor: 0.0000163871 },
                gallon_us: { name: { zh: '美制加仑 (gal)', en: 'US Gallon (gal)' }, factor: 0.00378541 },
                gallon_uk: { name: { zh: '英制加仑 (gal)', en: 'UK Gallon (gal)' }, factor: 0.00454609 },
            }
        },
        constants: {
            name: { zh: '常用常数', en: 'Common Constants' },
            isConstant: true, 
            // 增加 unit 字段
            list: {
                pi: { name: { zh: '圆周率 (π)', en: 'Pi (π)' }, value: Math.PI, unit: { zh: null, en: null } },
                e: { name: { zh: '自然常数 (e)', en: 'Euler\'s Number (e)' }, value: Math.E, unit: { zh: null, en: null } },
                g_const: { name: { zh: '标准重力 (g)', en: 'Standard Gravity (g)' }, value: 9.80665, unit: { zh: 'm/s²', en: 'm/s²' } },
                c_light: { name: { zh: '光速 (c)', en: 'Speed of Light (c)' }, value: 299792458, unit: { zh: 'm/s', en: 'm/s' } },
                h_planck: { name: { zh: '普朗克常数 (h)', en: 'Planck Constant (h)' }, value: 6.62607015e-34, unit: { zh: 'J·s', en: 'J·s' } },
                k_boltzmann: { name: { zh: '玻尔兹曼常数 (k)', en: 'Boltzmann Constant (k)' }, value: 1.380649e-23, unit: { zh: 'J/K', en: 'J/K' } },
                n_avogadro: { name: { zh: '阿伏伽德罗常数 (N_A)', en: 'Avogadro Constant (N_A)' }, value: 6.02214076e23, unit: { zh: 'mol⁻¹', en: 'mol⁻¹' } },
                g_grav: { name: { zh: '万有引力常数 (G)', en: 'Gravitational Constant (G)' }, value: 6.67430e-11, unit: { zh: 'm³/(kg·s²)', en: 'm³/(kg·s²)' } },
                r_gas: { name: { zh: '摩尔气体常数 (R)', en: 'Molar Gas Constant (R)' }, value: 8.314462618, unit: { zh: 'J/(mol·K)', en: 'J/(mol·K)' } }
            }
        },
    };

    // --- 3. 获取 DOM 元素 ---
    const mainTitle = document.getElementById('mainTitle');
    const categoryLabel = document.getElementById('categoryLabel');
    const inputLabel = document.getElementById('inputLabel');
    const resultLabel = document.getElementById('resultLabel');
    const versionLabel = document.getElementById('versionLabel');
    const authorLabel = document.getElementById('authorLabel'); 
    const versionNumber = document.getElementById('versionNumber');
    const langToggleButton = document.getElementById('langToggleButton');
    
    const categorySelect = document.getElementById('categorySelect');
    const inputValue = document.getElementById('inputValue');
    const fromUnitSelect = document.getElementById('fromUnitSelect');
    const toUnitSelect = document.getElementById('toUnitSelect');
    const resultValue = document.getElementById('resultValue');
    const swapButton = document.getElementById('swapButton');
    const fuelSelect = document.getElementById('fuelSelect');
    const fuelSelectContainer = document.getElementById('fuelSelectContainer');
    const fuelLabel = document.getElementById('fuelLabel');
    const dataSourceNote = document.getElementById('dataSourceNote');
    const dataSourceText = document.getElementById('dataSourceText');
    const standardValuesContainer = document.getElementById('standardValuesContainer');
    const standardValuesLabel = document.getElementById('standardValuesLabel');
    const standardValuesContent = document.getElementById('standardValuesContent'); 

    // --- 4. 核心功能函数 ---

    /**
     * 填充类别下拉框
     */
    function populateCategories() {
        categorySelect.innerHTML = '';
                // 排序顺序
                const categoryOrder = [
                    'water_quality', 'pressure', 'power', 'energy', 'fuel_heat_value', 'fuel_carbon_factor', 
                    'volumetric_flow', 'mass_flow', 
                    'density', 'specific_heat', 'thermal_conductivity', 'dynamic_viscosity', 'kinematic_viscosity', 
                    'speed', 'rotational_speed', 'acceleration', 
                    'temperature', 'length', 'mass', 'area', 'volume',
                    'constants' 
                ];
        
        categoryOrder.forEach(key => {
            if (units[key]) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = units[key].name[currentLang];
                categorySelect.appendChild(option);
            }
        });
    }

    /**
     * 根据所选类别更新单位下拉框
     */
    function updateUnitDropdowns() {
        const categoryKey = categorySelect.value;
        if (!categoryKey || !units[categoryKey]) return;
        
        const category = units[categoryKey];
        const unitList = category.list;

        // 清空旧选项
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        // 处理燃料相关类别
        if (category.isFuel) {
            // 显示燃料选择下拉框
            fuelSelectContainer.classList.remove('hidden');
            fuelLabel.textContent = translations[currentLang].selectFuel;
            
            // 显示数据来源说明
            if (dataSourceNote && dataSourceText) {
                dataSourceNote.style.display = 'block';
                dataSourceText.textContent = translations[currentLang].dataSource;
            }
            
            // 填充燃料选项
            fuelSelect.innerHTML = '';
            Object.keys(category.fuels).forEach(fuelKey => {
                const fuel = category.fuels[fuelKey];
                const option = document.createElement('option');
                option.value = fuelKey;
                option.textContent = fuel.name[currentLang];
                fuelSelect.appendChild(option);
            });
            
            // 默认选择第一个燃料
            if (fuelSelect.options.length > 0) {
                fuelSelect.selectedIndex = 0;
            }
            
            // 显示标准值
            updateStandardValues();
            
            // 填充单位选项（基于当前选择的燃料）
            updateFuelUnits();
            
            // 标准显示模式
            inputValue.style.display = 'block';
            toUnitSelect.style.display = 'block';
            swapButton.style.display = 'flex';
            
            inputLabel.textContent = translations[currentLang].input;
            resultLabel.textContent = translations[currentLang].result;
            
            convert();
            return;
        } else {
            // 隐藏燃料选择下拉框、数据来源说明和标准值
            fuelSelectContainer.classList.add('hidden');
            if (dataSourceNote) {
                dataSourceNote.style.display = 'none';
            }
            if (standardValuesContainer) {
                standardValuesContainer.style.display = 'none';
            }
        }

        if (category.isConstant) {
            // --- 常数显示模式 ---
            inputValue.style.display = 'none';
            toUnitSelect.style.display = 'none';
            swapButton.style.display = 'none';
            
            inputLabel.textContent = translations[currentLang].selectConstant;
            resultLabel.textContent = translations[currentLang].constantValue;

            Object.keys(unitList).forEach(key => {
                const name = unitList[key].name[currentLang];
                const fromOption = document.createElement('option');
                fromOption.value = key;
                fromOption.textContent = name;
                fromUnitSelect.appendChild(fromOption);
            });
            
            fromUnitSelect.selectedIndex = 0;
            showConstantValue();

        } else {
            // --- 单位换算模式 ---
            inputValue.style.display = 'block';
            toUnitSelect.style.display = 'block';
            swapButton.style.display = 'flex'; 
            
            inputLabel.textContent = translations[currentLang].input;
            resultLabel.textContent = translations[currentLang].result;

            // 填充新选项
            Object.keys(unitList).forEach(key => {
                const name = unitList[key].name[currentLang];
                
                const fromOption = document.createElement('option');
                fromOption.value = key;
                fromOption.textContent = name;
                fromUnitSelect.appendChild(fromOption);
                
                const toOption = document.createElement('option');
                toOption.value = key;
                toOption.textContent = name;
                toUnitSelect.appendChild(toOption);
            });

            // 智能默认选项设置
            const options = Array.from(fromUnitSelect.options).map(o => o.value);
            if (categoryKey === 'water_quality' && options.includes('us_cm') && options.includes('meg_ohm')) {
                // RO水默认：电导率 -> 电阻率
                fromUnitSelect.value = 'us_cm';
                toUnitSelect.value = 'meg_ohm';
            } else if (categoryKey === 'pressure' && options.includes('psi') && options.includes('bar')) {
                fromUnitSelect.value = 'psi';
                toUnitSelect.value = 'bar';
            } else if (categoryKey === 'power' && options.includes('ton_refrigeration') && options.includes('kilowatt')) {
                fromUnitSelect.value = 'ton_refrigeration';
                toUnitSelect.value = 'kilowatt';
            } else if (options.length > 1) {
                fromUnitSelect.selectedIndex = 0;
                toUnitSelect.selectedIndex = 1;
            } else if (options.length > 0) {
                fromUnitSelect.selectedIndex = 0;
                toUnitSelect.selectedIndex = 0;
            }
            
            convert();
        }
    }

    /**
     * 显示燃料的标准值（国家标准规定值）
     */
    function updateStandardValues() {
        const categoryKey = categorySelect.value;
        const fuelKey = fuelSelect.value;
        
        if (!categoryKey || !units[categoryKey] || !units[categoryKey].isFuel || !fuelKey) {
            if (standardValuesContainer) {
                standardValuesContainer.style.display = 'none';
            }
            return;
        }
        
        const category = units[categoryKey];
        const fuel = category.fuels[fuelKey];
        
        if (!standardValuesContainer || !standardValuesContent || !standardValuesLabel) return;
        
        standardValuesContainer.style.display = 'block';
        standardValuesLabel.textContent = translations[currentLang].standardValues;
        
        let html = '';
        
        if (categoryKey === 'fuel_heat_value') {
            // 显示热值标准值
            html = '<div class="space-y-1.5">';
            if (fuelKey === 'electricity') {
                html += `<div class="text-gray-600 italic">• 电力本身不具有热值概念，无法进行热值转换</div>`;
            } else {
                if (fuel.heatValueMJkg && fuel.heatValueMJkg > 0) {
                    html += `<div>• 质量热值：<span class="font-semibold text-blue-700">${formatNumber(fuel.heatValueMJkg)}</span> MJ/kg</div>`;
                    // 为管道蒸汽添加说明
                    if (fuelKey === 'steam') {
                        html += `<div class="text-xs text-gray-600 italic mt-1 ml-4 border-l-2 border-gray-300 pl-2">注：此为蒸汽热值（焓值），非生产蒸汽所需能量。生产1吨蒸汽约需700 kWh（约2.52 MJ/kg），但本标准采用蒸汽本身的热值。</div>`;
                    }
                }
                if (fuel.heatValueMJm3 && fuel.heatValueMJm3 > 0) {
                    html += `<div>• 体积热值（气体）：<span class="font-semibold text-blue-700">${formatNumber(fuel.heatValueMJm3)}</span> MJ/m³ (标准状态)</div>`;
                }
                if (fuel.heatValueMJL && fuel.heatValueMJL > 0) {
                    html += `<div>• 体积热值（液体）：<span class="font-semibold text-blue-700">${formatNumber(fuel.heatValueMJL)}</span> MJ/L</div>`;
                }
            }
            html += '</div>';
        } else if (categoryKey === 'fuel_carbon_factor') {
            // 显示碳因子标准值
            html = '<div class="space-y-1.5">';
            if (fuel.carbonFactorEnergy && fuel.carbonFactorEnergy > 0) {
                html += `<div>• 能量基准：<span class="font-semibold text-blue-700">${formatNumber(fuel.carbonFactorEnergy)}</span> kg CO₂/MJ</div>`;
            }
            if (fuel.carbonFactorMass && fuel.carbonFactorMass > 0) {
                html += `<div>• 质量基准：<span class="font-semibold text-blue-700">${formatNumber(fuel.carbonFactorMass)}</span> kg CO₂/kg 燃料</div>`;
            } else if (fuelKey === 'electricity') {
                html += `<div class="text-gray-600 italic">• 电力无质量基准碳因子（电力无质量概念）</div>`;
            }
            html += '</div>';
        }
        
        standardValuesContent.innerHTML = html;
    }

    /**
     * 更新燃料单位下拉框（基于选择的燃料）
     */
    function updateFuelUnits() {
        const categoryKey = categorySelect.value;
        const fuelKey = fuelSelect.value;
        
        if (!categoryKey || !units[categoryKey] || !units[categoryKey].isFuel || !fuelKey) return;
        
        const category = units[categoryKey];
        const fuel = category.fuels[fuelKey];
        const unitList = category.list;
        
        // 清空单位选项
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        
        // 根据燃料类型和单位类型过滤可用单位
        Object.keys(unitList).forEach(unitKey => {
            const unit = unitList[unitKey];
            let shouldInclude = false;
            
            if (categoryKey === 'fuel_heat_value') {
                // 电力没有热值概念，不显示任何单位
                if (fuelKey === 'electricity') {
                    shouldInclude = false;
                } else {
                    // 热值：根据燃料类型决定可用单位
                    if (unit.type === 'mass') {
                        shouldInclude = true; // 所有燃料都支持质量单位
                    } else if (unit.type === 'volume_gas' && (fuelKey === 'natural_gas' || fuelKey === 'lng' || fuelKey === 'steam' || fuelKey === 'hydrogen')) {
                        shouldInclude = true; // 气体燃料、蒸汽和氢气支持体积单位
                    } else if (unit.type === 'volume_liquid' && (fuelKey === 'gasoline' || fuelKey === 'diesel' || fuelKey === 'lpg' || fuelKey === 'lng')) {
                        shouldInclude = true; // 液体燃料支持体积单位
                    }
                }
            } else if (categoryKey === 'fuel_carbon_factor') {
                // 碳因子：根据燃料类型决定可用单位
                if (fuelKey === 'electricity') {
                    // 电力只支持能量基准单位（如果有的话）
                    // 目前所有单位都显示，但实际转换时只使用能量基准
                    shouldInclude = true;
                } else {
                    // 其他燃料：所有单位都可用
                    shouldInclude = true;
                }
            }
            
            if (shouldInclude) {
                const name = unit.name[currentLang];
                const fromOption = document.createElement('option');
                fromOption.value = unitKey;
                fromOption.textContent = name;
                fromUnitSelect.appendChild(fromOption);
                
                const toOption = document.createElement('option');
                toOption.value = unitKey;
                toOption.textContent = name;
                toUnitSelect.appendChild(toOption);
            }
        });
        
        // 设置默认选项
        const options = Array.from(fromUnitSelect.options).map(o => o.value);
        if (options.length > 1) {
            fromUnitSelect.selectedIndex = 0;
            toUnitSelect.selectedIndex = 1;
        } else if (options.length > 0) {
            fromUnitSelect.selectedIndex = 0;
            toUnitSelect.selectedIndex = 0;
        }
    }

    /**
     * 显示常数值 (带单位)
     */
    function showConstantValue() {
        const categoryKey = categorySelect.value;
        const constantKey = fromUnitSelect.value;

        if (!categoryKey || !constantKey || !units[categoryKey] || !units[categoryKey].isConstant) {
            resultValue.innerHTML = '<span class="text-gray-400">-</span>';
            resultValue.classList.remove('text-gray-800');
            resultValue.classList.add('text-gray-400');
            return;
        }
        
        const item = units[categoryKey].list[constantKey];
        const value = item.value;
        const unitStr = item.unit[currentLang] || (item.unit.zh ? item.unit.zh : translations[currentLang].unitNone);

        // 如果 unit 为 null (例如 Pi)，显示 '无单位' 或空
        const displayUnit = item.unit[currentLang] ? ` ${item.unit[currentLang]}` : ` (${translations[currentLang].unitNone})`;

        const formattedValue = formatNumber(value) + displayUnit;
        resultValue.innerHTML = `<span class="text-gray-800">${formattedValue}</span>`;
        resultValue.classList.remove('text-gray-400');
        resultValue.classList.add('text-gray-800');
    }

    /**
     * 执行换算
     */
    function convert() {
        const value = parseFloat(inputValue.value);
        const categoryKey = categorySelect.value;
        const fromUnitKey = fromUnitSelect.value;
        const toUnitKey = toUnitSelect.value;

        if (units[categoryKey] && units[categoryKey].isConstant) {
            showConstantValue();
            return;
        }

        if (isNaN(value) || !categoryKey || !fromUnitKey || !toUnitKey) {
            resultValue.innerHTML = '<span class="text-gray-400">-</span>';
            resultValue.classList.remove('text-gray-800');
            resultValue.classList.add('text-gray-400');
            return;
        }

        let result;

        // === 1. 温度换算 ===
        if (categoryKey === 'temperature') {
            result = convertTemperature(value, fromUnitKey, toUnitKey);
        } 
        // === 2. 水质换算 (电导/电阻) ===
        else if (categoryKey === 'water_quality') {
            result = convertWaterQuality(value, fromUnitKey, toUnitKey);
        }
        // === 3. 燃料热值换算 ===
        else if (categoryKey === 'fuel_heat_value') {
            result = convertFuelHeatValue(value, fromUnitKey, toUnitKey);
        }
        // === 4. 燃料碳因子换算 ===
        else if (categoryKey === 'fuel_carbon_factor') {
            result = convertFuelCarbonFactor(value, fromUnitKey, toUnitKey);
        }
        // === 5. 标准线性换算 (包括新加的转速) ===
        else {
            const category = units[categoryKey];
            const fromFactor = category.list[fromUnitKey].factor;
            const toFactor = category.list[toUnitKey].factor;
            
            const valueInBase = value * fromFactor;
            result = valueInBase / toFactor;
        }

        const formattedResult = formatNumber(result);
        resultValue.innerHTML = `<span class="text-gray-800">${formattedResult}</span>`;
        resultValue.classList.remove('text-gray-400');
        resultValue.classList.add('text-gray-800');
    }

    /**
     * 水质换算逻辑
     */
    function convertWaterQuality(value, fromKey, toKey) {
        if (value === 0 && units.water_quality.list[fromKey].type === 'res') {
            return 0; // 避免除以零
        }

        const list = units.water_quality.list;
        const fromData = list[fromKey];
        const toData = list[toKey];

        let valInMicroSiemens = 0;

        // Step 1: 转为 μS/cm
        if (fromData.type === 'cond') {
            valInMicroSiemens = value * fromData.factor;
        } else {
            const valInMegaOhm = value * fromData.factor; 
            if (valInMegaOhm === 0) return 0;
            valInMicroSiemens = 1 / valInMegaOhm;
        }

        // Step 2: 从 μS/cm 转为 目标单位
        if (toData.type === 'cond') {
            return valInMicroSiemens / toData.factor;
        } else {
            if (valInMicroSiemens === 0) return 0; 
            const resInMegaOhm = 1 / valInMicroSiemens;
            return resInMegaOhm / toData.factor;
        }
    }

    /**
     * 温度换算
     */
    function convertTemperature(value, from, to) {
        if (from === to) return value;
        let celsiusValue;
        // 转 Celsius
        switch (from) {
            case 'celsius': celsiusValue = value; break;
            case 'fahrenheit': celsiusValue = (value - 32) * 5 / 9; break;
            case 'kelvin': celsiusValue = value - 273.15; break;
        }
        // 转 目标
        switch (to) {
            case 'celsius': return celsiusValue;
            case 'fahrenheit': return (celsiusValue * 9 / 5) + 32;
            case 'kelvin': return celsiusValue + 273.15;
        }
    }

    /**
     * 燃料热值换算
     * 支持质量单位和体积单位之间的转换
     */
    function convertFuelHeatValue(value, fromUnitKey, toUnitKey) {
        const categoryKey = 'fuel_heat_value';
        if (!fuelSelect) return 0;
        const fuelKey = fuelSelect.value;
        const category = units[categoryKey];
        if (!category || !fuelKey) return 0;
        const fuel = category.fuels[fuelKey];
        const fromUnit = category.list[fromUnitKey];
        const toUnit = category.list[toUnitKey];
        
        if (!fuel || !fromUnit || !toUnit) return 0;
        
        // 电力没有热值概念，返回0
        if (fuelKey === 'electricity') {
            return 0;
        }
        
        // 先转换为基准单位（MJ/kg 或 MJ/m³ 或 MJ/L）
        let valueInBaseMJ = 0;
        
        if (fromUnit.type === 'mass') {
            // 质量单位：转换为 MJ/kg
            valueInBaseMJ = value / fromUnit.factor;
        } else if (fromUnit.type === 'volume_gas') {
            // 气体体积单位：转换为 MJ/m³
            valueInBaseMJ = value / fromUnit.factor;
        } else if (fromUnit.type === 'volume_liquid') {
            // 液体体积单位：转换为 MJ/L
            valueInBaseMJ = value / fromUnit.factor;
        }
        
        // 如果单位类型相同，直接转换
        if (fromUnit.type === toUnit.type) {
            return valueInBaseMJ * toUnit.factor;
        }
        
        // 跨类型转换：需要用到燃料的热值数据
        let valueInTargetBase = 0;
        
        if (fromUnit.type === 'mass' && toUnit.type === 'volume_gas') {
            // 质量 → 气体体积：需要燃料的密度或体积热值
            if (fuel.heatValueMJm3 && fuel.heatValueMJkg) {
                // 质量热值转换为体积热值
                valueInTargetBase = valueInBaseMJ * (fuel.heatValueMJm3 / fuel.heatValueMJkg);
            } else {
                return 0;
            }
        } else if (fromUnit.type === 'mass' && toUnit.type === 'volume_liquid') {
            // 质量 → 液体体积
            if (fuel.heatValueMJL && fuel.heatValueMJkg) {
                valueInTargetBase = valueInBaseMJ * (fuel.heatValueMJL / fuel.heatValueMJkg);
            } else {
                return 0;
            }
        } else if (fromUnit.type === 'volume_gas' && toUnit.type === 'mass') {
            // 气体体积 → 质量
            if (fuel.heatValueMJm3 && fuel.heatValueMJkg) {
                valueInTargetBase = valueInBaseMJ * (fuel.heatValueMJkg / fuel.heatValueMJm3);
            } else {
                return 0;
            }
        } else if (fromUnit.type === 'volume_liquid' && toUnit.type === 'mass') {
            // 液体体积 → 质量
            if (fuel.heatValueMJL && fuel.heatValueMJkg) {
                valueInTargetBase = valueInBaseMJ * (fuel.heatValueMJkg / fuel.heatValueMJL);
            } else {
                return 0;
            }
        } else if (fromUnit.type === 'volume_gas' && toUnit.type === 'volume_liquid') {
            // 气体体积 → 液体体积（通过质量热值中转）
            if (fuel.heatValueMJm3 && fuel.heatValueMJkg && fuel.heatValueMJL) {
                const valueInMass = valueInBaseMJ * (fuel.heatValueMJkg / fuel.heatValueMJm3);
                valueInTargetBase = valueInMass * (fuel.heatValueMJL / fuel.heatValueMJkg);
            } else {
                return 0;
            }
        } else if (fromUnit.type === 'volume_liquid' && toUnit.type === 'volume_gas') {
            // 液体体积 → 气体体积（通过质量热值中转）
            if (fuel.heatValueMJL && fuel.heatValueMJkg && fuel.heatValueMJm3) {
                const valueInMass = valueInBaseMJ * (fuel.heatValueMJkg / fuel.heatValueMJL);
                valueInTargetBase = valueInMass * (fuel.heatValueMJm3 / fuel.heatValueMJkg);
            } else {
                return 0;
            }
        }
        
        // 转换为目标单位
        return valueInTargetBase * toUnit.factor;
    }

    /**
     * 燃料碳因子换算
     */
    function convertFuelCarbonFactor(value, fromUnitKey, toUnitKey) {
        const categoryKey = 'fuel_carbon_factor';
        if (!fuelSelect) return 0;
        const fuelKey = fuelSelect.value;
        const category = units[categoryKey];
        if (!category || !fuelKey) return 0;
        const fuel = category.fuels[fuelKey];
        const fromUnit = category.list[fromUnitKey];
        const toUnit = category.list[toUnitKey];
        
        if (!fuel || !fromUnit || !toUnit) return 0;
        
        // 先转换为基准单位
        let valueInBase = 0;
        
        if (fromUnit.type === 'energy') {
            // 能量单位：转换为 kg CO₂/MJ
            valueInBase = value / fromUnit.factor;
        } else if (fromUnit.type === 'mass') {
            // 质量单位：转换为 kg CO₂/kg
            // 需要先转换为能量基准，再转换
            // kg CO₂/kg = (kg CO₂/MJ) × (MJ/kg)
            // 所以：kg CO₂/MJ = (kg CO₂/kg) / (MJ/kg)
            if (units.fuel_heat_value && units.fuel_heat_value.fuels[fuelKey]) {
                const heatValue = units.fuel_heat_value.fuels[fuelKey].heatValueMJkg;
                valueInBase = (value / fromUnit.factor) / heatValue;
            } else {
                return 0;
            }
        }
        
        // 再从基准单位转换为目标单位
        let result = 0;
        if (toUnit.type === 'energy') {
            result = valueInBase * toUnit.factor;
        } else if (toUnit.type === 'mass') {
            // 从能量基准转换为质量基准
            // 对于电力，没有质量热值，返回0
            if (fuelKey === 'electricity') {
                return 0;
            }
            if (units.fuel_heat_value && units.fuel_heat_value.fuels[fuelKey]) {
                const heatValue = units.fuel_heat_value.fuels[fuelKey].heatValueMJkg;
                if (!heatValue || heatValue === 0) {
                    return 0;
                }
                result = (valueInBase * heatValue) * toUnit.factor;
            } else {
                return 0;
            }
        }
        
        return result;
    }

    /**
     * 格式化数字显示
     */
    function formatNumber(num) {
        if (num === 0) return 0;
        if (!isFinite(num)) return "∞";
        
        if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && Math.abs(num) > 0)) {
            return num.toExponential(6);
        }
        
        let formatted = num.toPrecision(12);
        if (formatted.includes('.')) {
            formatted = formatted.replace(/0+$/, '').replace(/\.$/, '');
        }
        return formatted;
    }

    /**
     * 交换单位
     */
    function swapUnits() {
        const categoryKey = categorySelect.value;
        if (units[categoryKey] && units[categoryKey].isConstant) return;

        const fromValue = fromUnitSelect.value;
        const toValue = toUnitSelect.value;
        
        fromUnitSelect.value = toValue;
        toUnitSelect.value = fromValue;
        
        convert();
    }

    /**
     * 更新界面语言
     */
    function updateLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        
        const t = translations[lang];
        mainTitle.textContent = t.title;
        categoryLabel.textContent = t.category;
        versionLabel.textContent = t.version;
        authorLabel.textContent = t.author; 
        versionNumber.textContent = version;
        langToggleButton.textContent = t.langToggle;
        
        const oldCategory = categorySelect.value;
        const oldFrom = fromUnitSelect.value;
        const oldTo = toUnitSelect.value;
        const oldFuel = fuelSelect ? fuelSelect.value : null;

        populateCategories();
        if (Array.from(categorySelect.options).some(o => o.value === oldCategory)) {
            categorySelect.value = oldCategory;
        }

        updateUnitDropdowns();
        
        // 更新燃料选择下拉框的语言和数据来源说明
        if (fuelSelect && oldFuel) {
            const category = units[categorySelect.value];
            if (category && category.isFuel) {
                fuelSelect.innerHTML = '';
                Object.keys(category.fuels).forEach(fuelKey => {
                    const fuel = category.fuels[fuelKey];
                    const option = document.createElement('option');
                    option.value = fuelKey;
                    option.textContent = fuel.name[currentLang];
                    fuelSelect.appendChild(option);
                });
                if (Array.from(fuelSelect.options).some(o => o.value === oldFuel)) {
                    fuelSelect.value = oldFuel;
                }
                if (dataSourceText) {
                    dataSourceText.textContent = translations[currentLang].dataSource;
                }
                updateStandardValues();
                updateFuelUnits();
            }
        }

        if (Array.from(fromUnitSelect.options).some(o => o.value === oldFrom)) {
            fromUnitSelect.value = oldFrom;
        }
        if (Array.from(toUnitSelect.options).some(o => o.value === oldTo)) {
            toUnitSelect.value = oldTo;
        }
        
        const category = units[categorySelect.value];
        if (category && category.isConstant) {
            showConstantValue();
        } else {
            convert();
        }
    }

    // --- 5. 绑定事件监听器 ---
    langToggleButton.addEventListener('click', () => {
        const newLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage(newLang);
    });

    swapButton.addEventListener('click', swapUnits); 

    categorySelect.addEventListener('change', updateUnitDropdowns);
    inputValue.addEventListener('input', convert);
    
    // 燃料选择变化时更新单位下拉框和标准值
    if (fuelSelect) {
        fuelSelect.addEventListener('change', () => {
            const categoryKey = categorySelect.value;
            if (units[categoryKey] && units[categoryKey].isFuel) {
                updateStandardValues();
                updateFuelUnits();
                convert();
            }
        });
    }
    
    fromUnitSelect.addEventListener('change', () => {
        const categoryKey = categorySelect.value;
        if (units[categoryKey] && units[categoryKey].isConstant) {
            showConstantValue();
        } else {
            convert();
        }
    });
    
    toUnitSelect.addEventListener('change', convert);

    // --- 6. 初始化 ---
    updateLanguage(currentLang);
    inputValue.value = 1; 
    
    // 如果默认是水质，显示一个典型的电阻率
    if (categorySelect.value === 'water_quality') {
        inputValue.value = 18.2; 
        fromUnitSelect.value = 'meg_ohm';
        toUnitSelect.value = 'us_cm';
        convert();
    } else {
         const initialCategory = units[categorySelect.value];
        if (initialCategory && initialCategory.isConstant) {
            showConstantValue();
        } else {
            convert();
        }
    }
});

