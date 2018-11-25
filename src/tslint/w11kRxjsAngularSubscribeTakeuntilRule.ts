import {tsquery} from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import {couldBeType} from "./util";

function getClassesWithAnnotation(sourceFile: ts.SourceFile, annotationName: string) {
    const componentAnnotations = tsquery(
        sourceFile,
        `ClassDeclaration Decorator CallExpression Identifier[name='${annotationName}']`
    );

    return componentAnnotations.map(ca => ca.parent.parent.parent);
}

function hasImport(sourceFile: ts.SourceFile, moduleName: string, namedImport: string): boolean {
    let importFound = false;
    const angularCoreImports = tsquery(
        sourceFile,
        `ImportDeclaration StringLiteral[value='${moduleName}']`
    );

    angularCoreImports.forEach(stringLiteral => {
        const componentImports = tsquery(
            stringLiteral.parent,
            `NamedImports Identifier[name='${namedImport}']`
        );
        if (componentImports.length > 0) {
            importFound = true;
        }
    });

    return importFound;
}

// noinspection JSUnusedGlobalSymbols
export class Rule extends Lint.Rules.TypedRule {

    // noinspection JSUnusedGlobalSymbols
    static metadata: Lint.IRuleMetadata = {
        description: "Enforces that `.pipe(..., takeUntil(...))` is called before `.subscribe()` within an Angular component/directive/pipe.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "w11k-rxjs-angular-subscribe-takeuntil",
        type: "style",
        typescriptOnly: true
    };

    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const failures: Lint.RuleFailure[] = [];
        const typeChecker = program.getTypeChecker();
        let relevantClasses: ts.Node[] = [];

        if (hasImport(sourceFile, "@angular/core", "Component")) {
            relevantClasses = [
                ...relevantClasses,
                ...getClassesWithAnnotation(sourceFile, "Component"),
            ];
        }

        if (hasImport(sourceFile, "@angular/core", "Directive")) {
            relevantClasses = [
                ...relevantClasses,
                ...getClassesWithAnnotation(sourceFile, "Directive"),
            ];
        }

        if (hasImport(sourceFile, "@angular/core", "Pipe")) {
            relevantClasses = [
                ...relevantClasses,
                ...getClassesWithAnnotation(sourceFile, "Pipe"),
            ];
        }

        if (hasImport(sourceFile, "@angular/core", "Injectable")) {
            relevantClasses = [
                ...relevantClasses,
                ...getClassesWithAnnotation(sourceFile, "Injectable"),
            ];
        }

        relevantClasses.forEach(classDeclaration => {
            const propertyAccessExpressions = tsquery(
                classDeclaration,
                `CallExpression PropertyAccessExpression[name.name="subscribe"]`
            );
            propertyAccessExpressions.forEach(node => {
                const propertyAccessExpression = node as ts.PropertyAccessExpression; // .subscribe
                const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);
                if (couldBeType(type, "Observable")) {
                    const {name} = propertyAccessExpression;

                    const objWithSubscribeExpression = propertyAccessExpression.expression as ts.CallExpression;
                    const beforeSubscribeExpression = objWithSubscribeExpression.expression as ts.PropertyAccessExpression;

                    if (beforeSubscribeExpression === undefined
                        || beforeSubscribeExpression.name === undefined
                        || beforeSubscribeExpression.name.escapedText !== "pipe") {
                        failures.push(new Lint.RuleFailure(
                            sourceFile,
                            name.getStart(),
                            name.getStart() + name.getWidth(),
                            "Missing `.pipe(...)` before .subscribe()",
                            this.ruleName
                        ));
                        return;
                    }

                    let pipeCallArguments = objWithSubscribeExpression.arguments;
                    let missingTakeUntil = false;
                    if (pipeCallArguments.length === 0) {
                        missingTakeUntil = true;
                    } else {
                        const lastArg = pipeCallArguments[pipeCallArguments.length - 1] as ts.CallExpression;
                        const takeUntilCall = lastArg.expression as ts.Identifier;
                        if (takeUntilCall.escapedText !== "takeUntil"
                            && takeUntilCall.escapedText !== "untilComponentDestroyed") {
                            missingTakeUntil = true;
                        }
                    }
                    if (missingTakeUntil) {
                        failures.push(new Lint.RuleFailure(
                            sourceFile,
                            name.getStart(),
                            name.getStart() + name.getWidth(),
                            "Missing `takeUntil(...) or untilComponentDestroyed(this)` as last pipe-operator",
                            this.ruleName
                        ));
                        return;
                    }
                }
            });
        });
        return failures;
    }
}
